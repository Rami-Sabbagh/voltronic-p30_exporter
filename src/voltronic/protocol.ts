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
    /**
     * Delay in milliseconds before each retry attempt.
     * 
     * Retry is attempted as much number as there in this array.
     */
    retryPauses?: number[],
}

const defaultOptions: Required<VoltronicProtocolOptions> = {
    delay: 0,
    timeout: 1000,
    retryPauses: [10, 100, 500, 1000, 2000],
};

const NAK = packMessage('(NAK');

export class VoltronicProtocol {
    protected stream: Duplex;
    protected parser = new DelimiterParser({
        delimiter: '\r', includeDelimiter: true,
    });
    protected mutex = new Mutex();
    protected readonly options: Readonly<Required<VoltronicProtocolOptions>>;

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

    constructor(transport: string | Duplex, options: VoltronicProtocolOptions = {}) {
        this.options = Object.setPrototypeOf(options, defaultOptions);

        // FIXME: Handle transport failure and create a new protocol instance.
        this.stream = (typeof transport === 'string')
            ? new SerialPort({ path: transport, baudRate: 2400 })
            : transport;

        this.stream.pipe(this.parser);
    }

    async execute(command: string, regex?: RegExp): Promise<string>;
    async execute(command: string, raw: true): Promise<Buffer>;
    async execute(command: string, option?: boolean | RegExp): Promise<string | Buffer> {
        const raw = option === true;
        const regex = option instanceof RegExp ? option : undefined;

        return this.mutex.runExclusive(async () => {
            for (const retryPause of this.options['retryPauses']) {
                await delay(this.options['delay']);

                try {
                    // Discard any content in the parser buffer.
                    this.parser.buffer = Buffer.alloc(0);
                    this.stream.write(packMessage(command));

                    const data = await this.read(this.options['timeout']);
                    if (data.equals(NAK)) throw 'Negative acknowledgment.';

                    if (raw) {
                        const response = unpackMessage(data, true);
                        if (response[0] !== 0x28) throw 'Response missing leading "(".';
                        return response.subarray(1);
                    } else {
                        let response = unpackMessage(data);
                        if (response[0] !== '(') throw 'Response missing leading "(".';
                        response = response.substring(1);
                        if (regex && !regex.test(response)) throw "Response doesn't match the regular expression.";
                        return response;
                    }

                } catch (error) {
                    console.error(`Command (${command}) failed:`, error);
                    console.error(`Retrying after ${retryPause}ms...`);
                    await delay(retryPause);
                }
            }

            throw `Failed after ${this.options['retryPauses'].length + 1} attempts.`;
        });
    }

    destroy(): void {
        this.stream.destroy();
        this.parser.destroy();
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

            this.parser.once('data', onData);
            this.parser.once('error', onError);
        });
    }
}