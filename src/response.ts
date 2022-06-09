class response{
    public statusCode: number;
    public headers: { [key: string]: any };
    
    private body: Buffer | null = null;
    private data: Buffer[] = [];
    private done: boolean = false;
    private headerDone: boolean = false;
    private method: string | undefined;

    constructor(method?: string) {
        this.statusCode = 200;
        this.headers = {};
        if (method) this.method = method;
    }

    public write(chunk: Buffer): boolean { 
        if (this.done) throw new Error("Response already finished");
        if (!this.headerDone) {
            if (this.parseHeader(chunk)) {
                this.headerDone = true;
                if (this.method == "HEAD") {
                    this.done = true;
                } else {
                    checkLength(this.data[0].length, this);
                }
            }
        } else {
            this.data.push(chunk);
            let totalLength = 0;
            for (let i = 0; i < this.data.length; i++) { 
                totalLength += this.data[i].length;
            }
          
            checkLength(totalLength, this);
        }

        function checkLength(length: number, t: response): boolean {
            if (length >= t.headers['Content-Length']) {
                t.body = Buffer.concat(t.data);
                t.data = [];
                t.done = true;
            }
            return t.done;
        }

        return this.done;
    }
    

    private parseHeader(data: Buffer): boolean {
        let header = data.toString('ascii');
        let lines = header.split("\r\n");
        let flag = false;

        let status = lines[0].split(" ");
        this.statusCode = Number(status[1]);
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i] || lines[i] == "\r\n") {
                const temp = Buffer.from(lines.slice(0, i).join("\r\n") + "\r\n", 'ascii').length;
                if (this.headers['Content-Length']) this.data.push(data.slice(temp + 2, temp + this.headers['Content-Length']));
                else this.data.push(data.slice(temp));
                break;
            }

            let line = lines[i].split(":");
            this.headers[line[0].trim()] = isNaN(parseInt(line[1].trim())) ? line[1].trim() : parseInt(line[1].trim());
        
            if (i == lines.length) flag = true; 
        }

        return !flag;
    }

    public getRaw(): Buffer {
        if (this.body && this.done) {
            return this.body;
        } else if (this.method == "HEAD") {
            throw new Error("This function is not supported in HEAD method");
        }
        else {
            throw new Error("Response not finished");
        }
    }

    public getText(encoding: BufferEncoding = 'ascii'): string { 
        return this.getRaw().toString(encoding);
    }

}

export {response}