import { VoltronicProtocol } from './structures';

export class VoltronicCachedProtocol implements VoltronicProtocol {
    async execute(command: string, regex?: RegExp | undefined): Promise<string>;
    async execute(command: string, raw: true): Promise<Buffer>;
    async execute(command: unknown, raw?: unknown): Promise<Buffer | string> {
        throw new Error('Method not implemented.');
    }

    destroy(): void {
        throw new Error('Method not implemented.');
    }
}