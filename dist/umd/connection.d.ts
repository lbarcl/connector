/// <reference types="node" />
/// <reference types="node" />
import { response } from "./response.js";
import EventEmitter from "events";
declare class HTTPConnection extends EventEmitter {
    private port;
    private host;
    private socket;
    private urlObj;
    protected connected: boolean;
    headers: {
        [key: string]: string | number;
    };
    timeout: number;
    constructor(Target: string, options?: {
        timeout?: number;
    });
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    protected formatRequest(method: string, url: string, headers: {
        [key: string]: string | number;
    }, body?: any): string;
    setHeader(key: string, value: string | number): void;
    removeHeader(key: string): void;
    send(data: Buffer): void;
    protected recive(method: string): Promise<response>;
}
declare class HTTPClient extends HTTPConnection {
    constructor(Target: string, options?: {
        timeout?: number;
    });
    get(url: string): Promise<response>;
    post(url: string, body: any): Promise<response>;
    put(url: string, body: any): Promise<response>;
    delete(url: string, body: any): Promise<response>;
    head(url: string): Promise<response>;
    patch(url: string, body: any): Promise<response>;
}
export { HTTPConnection, HTTPClient };
//# sourceMappingURL=connection.d.ts.map