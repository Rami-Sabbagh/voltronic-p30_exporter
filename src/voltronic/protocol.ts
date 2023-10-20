import { Duplex } from 'node:stream';

import { SerialPort, DelimiterParser } from 'serialport';
import { Mutex } from 'async-mutex';
import { packMessage, unpackMessage } from './messages';
import { delay } from './utilities';

export interface VoltronicProtocolOptions {
    /**
     * Milliseconds to wait before sending a command.
     */
    delay?: number,
    /**
     * Milliseconds before giving up on a response arriving.
     */
    timeout?: number,
}

const defaultOptions = {
    delay: 50,
    timeout: 2000,
} satisfies Required<VoltronicProtocolOptions>;

export class VoltronicProtocol {
    protected stream: Duplex;
    protected parser = new DelimiterParser({
        delimiter: '\r', includeDelimiter: true,
    });
    protected mutex = new Mutex();

    /**
     * Open a serial connection with a voltronic device.
     * 
     * For more control over the connection options open the port manually
     * and pass the duplex stream instead.
     * 
     * @param path The system path of the serial port you want to open.
     * For example, `/dev/tty.XXX` on Mac/Linux, or `COM1` on Windows
     */
    constructor(path: string, options?: VoltronicProtocolOptions);

    /**
     * Communicate with a voltronic device regardless
     * of the transport used.
     */
    constructor(stream: Duplex, options?: VoltronicProtocolOptions);

    constructor(source: string | Duplex, protected readonly options: VoltronicProtocolOptions = {}) {
        // FIXME: Handle transport failure and create a new protocol instance.
        this.stream = (typeof source === 'string')
            ? new SerialPort({ path: source, baudRate: 2400 })
            : source;
        
        this.stream.pipe(this.parser);
    }

    // TODO: Exclusive command execution using a Mutex.
    // TODO: Add timeout.

    // TODO: Setup a single time listener for data and errors.
    // TODO: Auto-retry logic.

    async execute(command: string): Promise<string>;
    async execute(command: string, raw: true): Promise<Buffer>;
    async execute(command: string, raw?: boolean): Promise<string | Buffer> {
        return this.mutex.runExclusive(async () => {
            await delay(this.option('delay'));

            // Discard any content in the parser buffer.
            this.parser.buffer = Buffer.alloc(0);
            this.stream.write(packMessage(command));

            const data = await this.read(this.option('timeout'));

            if (raw) {
                const response = unpackMessage(data, true);
                if (response[0] !== 0x28) throw 'Response missing leading "(".';
                return response.subarray(1);
            } else { 
                const response = unpackMessage(data);
                if (response[0] !== '(') throw 'Response missing leading "(".';
                return response.substring(1);
            }
        });
    }

    destroy(): void {
        this.stream.destroy();
    }

    protected async read(timeout?: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            let onData: (data: Buffer) => void;
            let onError: (error: unknown) => void;
            let timeoutId: NodeJS.Timeout | undefined;

            onData = (data) => {
                clearTimeout(timeoutId);
                this.parser.off('error', onError);
                resolve(data);
            };

            onError = (error) => {
                clearTimeout(timeoutId);
                this.parser.off('data', onData);
                reject(error);
            };

            if (timeout !== undefined)
                timeoutId = setTimeout(() => {
                    this.parser.off('data', onData);
                    this.parser.off('error', onError);
                    reject('Timeout');
                }, timeout);

            this.parser.once('data', resolve);
            this.parser.once('error', reject);
        });
    }

    protected option<T extends keyof VoltronicProtocolOptions>(key: T): Required<VoltronicProtocolOptions>[T] {
        return this.options[key] ?? defaultOptions[key];
    }
}