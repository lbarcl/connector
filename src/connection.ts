import net from "net";
import tls from "tls";
import url from "url";
import { response } from "./response.js";
import EventEmitter from "events";

class HTTPConnection extends EventEmitter {
    private port: number;
    private host: string;
    private socket: net.Socket;
    private urlObj: url.URL;

    protected connected: boolean = false;
    public headers: { [key: string]: string | number } = {};
    public timeout: number = 5000;

    constructor(Target: string, options?: { timeout?: number }) {
        super();
        this.urlObj = new url.URL(Target);
        this.port = Number(this.urlObj.port) || this.urlObj.protocol === "https:" ? 443 : 80;
        
        if (!this.urlObj.hostname) throw new Error("Invalid URL");
        this.host = this.urlObj.hostname;
    
        this.socket = new net.Socket();    

        this.setHeader("Host", this.urlObj.hostname);

        this.socket.on("error", (error: Error) => {
            throw error;
        });
        this.socket.on("close", () => this.connected = false);

        if (options) { 
            this.timeout = options.timeout || this.timeout;
        }
    }

    public connect(): Promise<boolean> { 
        return new Promise((resolve, reject) => {
            try {
                if (this.connected) resolve(true);
                if (this.urlObj.protocol === "https:") {
                    const tlsContext = tls.createSecureContext({maxVersion: 'TLSv1.3', minVersion: 'TLSv1.2'});
                    this.socket = tls.connect(this.port, this.host, { rejectUnauthorized: false, servername: this.host, secureContext: tlsContext }, () => { });
                } else {
                    this.socket.connect(this.port, this.host);
                }

                this.socket.once('connect', () => {
                    this.connected = true;
                    resolve(true);
                });
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    public disconnect(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                //console.log('disconnecting')
                if (this.connected) resolve(true);
                this.socket.connect(this.port, this.host);
                this.socket.once('close', () => {
                    this.connected = false;
                    resolve(true);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    protected formatRequest(method: string, url: string, headers: {[key: string]: string | number}, body?: any): string {
        let request = `${method} ${url} HTTP/1.1\r\n`;
        for (let key in headers) {
            request += `${key}: ${headers[key]}\r\n`;
        }
        request += "\r\n";

        if (body) {
            request += body;
        }
        
        return request;
    }

    public setHeader(key: string, value: string | number): void {
        this.headers[key] = value;
    }

    public removeHeader(key: string): void { 
        delete this.headers[key];
    }

    public send(data: Buffer): void {
        if (!this.connected) throw new Error("Not connected");
        try {
            this.socket.write(data);
        } catch (error) {
            throw error;
        }
    }

    protected recive(method: string): Promise<response> {
        return new Promise((resolve, reject) => {
            let res: response = new response(method);
            this.socket.on('data', (data: Buffer) => { 
                this.emit('data', data);
                if (res.write(data)) {
                    this.socket.removeAllListeners('data');
                    resolve(res);
                }
            
            });

            setTimeout(() => {
                if (!res.headers['Content-Length']) resolve(res)
            }, this.timeout);
        });
    }
};

class HTTPClient extends HTTPConnection { 
    constructor(Target: string, options?: { timeout?: number }) {
        super(Target, options);
    }

    public async get(url: string): Promise<response> {
        if (!this.connected) throw new Error("Must be connected to send request");
        console.log("sending request")
        let request = this.formatRequest("GET", url, this.headers);
        this.send(Buffer.from(request, 'ascii'));

        
        const response = await this.recive('GET');
        return response;
    }

    public async post(url: string, body: any): Promise<response> {
        if (!this.connected) throw new Error("Must be connected to send request");
        let request = this.formatRequest("POST", url, this.headers, body);
        this.send(Buffer.from(request, 'ascii'));

        const response = await this.recive('POST');
        return response;
    }

    public async put(url: string, body: any): Promise<response> { 
        if (!this.connected) throw new Error("Must be connected to send request");
        let request = this.formatRequest("PUT", url, this.headers, body);
        this.send(Buffer.from(request, 'ascii'));

        const response = await this.recive('PUT');
        return response;
    }

    public async delete(url: string, body: any): Promise<response> {
        if (!this.connected) throw new Error("Must be connected to send request");
        let request = this.formatRequest("DELETE", url, this.headers, body);
        this.send(Buffer.from(request, 'ascii'));

        const response = await this.recive('DELETE');
        return response;
    }

    public async head(url: string): Promise<response> {
        if (!this.connected) throw new Error("Must be connected to send request");
        let request = this.formatRequest("HEAD", url, this.headers);
        this.send(Buffer.from(request, 'ascii'));

        const response = await this.recive('HEAD');
        return response;
    }

    public async patch(url: string, body: any): Promise<response> {
        if (!this.connected) throw new Error("Must be connected to send request");
        let request = this.formatRequest("PATCH", url, this.headers, body);
        this.send(Buffer.from(request, 'ascii'));

        const response = await this.recive('PATCH');
        return response;
    }
}

export { HTTPConnection, HTTPClient }