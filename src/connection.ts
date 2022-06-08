import net from "net";
import tls from "tls";
import url from "url";
import {response} from "./response.js";

class connection {
    private port: number;
    private host: string;
    private socket: net.Socket;
    private urlObj: url.URL;

    protected connected: boolean = false;
    public headers: {[key: string]: string | number} = {};

    constructor(Target: string) {
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

    private formatRequest(method: string, url: string, headers: {[key: string]: string | number}, body?: any): string {
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

    private recive(): Promise<response> {
        return new Promise((resolve, reject) => {
            let res: response = new response();
            let flag = false;
            this.socket.on('data', (data: Buffer) => { 
                console.log('reciving')
                if (!flag) {
                    if (res.write(data)) {
                        flag = true;
                        resolve(res);
                    }
                }
            });

            
        });
    }

    public async get(url: string): Promise<response> {
        if (!this.connected) throw new Error("Must be connected to send request");
        console.log("sending request")
        let request = this.formatRequest("GET", url, this.headers);
        this.send(Buffer.from(request, 'ascii'));

        
        const response = await this.recive();
        return response;
    }
};

export { connection }