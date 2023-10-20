import { Duplex } from 'node:stream';

import { SerialPort, DelimiterParser } from 'serialport';
import { Mutex } from 'async-mutex';
import { packMessage, unpackMessage } from './messages';
import { delay } from './utilities';


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
    constructor(path: string);

    /**
     * Communicate with a voltronic device regardless
     * of the transport used.
     */
    constructor(stream: Duplex);

    constructor(source: string | Duplex) {
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

    async execute(command: string): Promise<string> {
        return this.mutex.runExclusive(async () => {
            await delay(1000);

            // Discard any content in the parser buffer.
            this.parser.buffer = Buffer.alloc(0);
            this.stream.write(packMessage(command));

            const data = await this.read();
            let response = unpackMessage(data);

            if (response[0] !== '(') throw 'Response missing leading "(".';
            response = response.substring(1);

            return response;
        });
    }

    destroy(): void {
        this.stream.destroy();
    }

    protected async read(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            let onData: (data: Buffer) => void;
            let onError: (error: unknown) => void;

            onData = (data) => {
                this.parser.off('error', onError);
                resolve(data);
            };

            onError = (error) => {
                this.parser.off('data', onData);
                reject(error);
            };

            this.parser.once('data', resolve);
            this.parser.once('error', reject);
        });
    }
}