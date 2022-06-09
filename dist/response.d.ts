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
    private method;
    constructor(method?: string);
    write(chunk: Buffer): boolean;
    private parseHeader;
    getRaw(): Buffer;
    getText(encoding?: BufferEncoding): string;
}
export { response };
//# sourceMappingURL=response.d.ts.map