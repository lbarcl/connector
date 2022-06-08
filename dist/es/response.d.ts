/// <reference types="node" />
declare class response {
    statusCode: number;
    headers: {
        [key: string]: any;
    };
    private body;
    private data;
    private done;
    private headerDone;
    constructor();
    write(chunk: Buffer): boolean;
    private parseHeader;
    getRaw(): Buffer;
    getText(encoding?: BufferEncoding): Promise<string>;
}
export { response };
//# sourceMappingURL=response.d.ts.map