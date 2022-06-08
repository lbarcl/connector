/// <reference types="node" />
import { response } from "./response.js";
declare class connection {
    private port;
    private host;
    private socket;
    private urlObj;
    connected: boolean;
    headers: {
        [key: string]: string | number;
    };
    constructor(Target: string);
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    private formatRequest;
    setHeader(key: string, value: string | number): void;
    removeHeader(key: string): void;
    send(data: Buffer): void;
    private recive;
    get(url: string): Promise<response>;
}
export { connection };
//# sourceMappingURL=connection.d.ts.map