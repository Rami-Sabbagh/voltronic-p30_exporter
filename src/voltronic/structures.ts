export interface VoltronicProtocol {
    execute(command: string, regex?: RegExp): Promise<string>;
    execute(command: string, raw: true): Promise<Buffer>;
    destroy(): void;
}