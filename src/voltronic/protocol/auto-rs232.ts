import { SerialPort } from 'serialport';
import { PortInfo } from '@serialport/bindings-cpp';

import { VoltronicProtocol } from '../structures';
import { VoltronicRS232Protocol, VoltronicRS232ProtocolOptions } from './rs232';
import { NoRS232Port } from '../errors';

export interface VoltronicAutoRS232ProtocolOptions {
    path?: 'auto' | string;

    /**
     * Serial devices to exclude when using auto mode (`path = 'auto'`).
     * 
     * Entries are predicates that get the port information passed.
     */
    exclude?: ((port: PortInfo) => boolean)[],

    /**
     * The options to use when creating the `VoltronicRS232Protocol` instance.
     */
    rs232?: VoltronicRS232ProtocolOptions,
}

const defaultOptions: Required<VoltronicAutoRS232ProtocolOptions> = {
    path: 'auto',
    exclude: [],
    rs232: {},
};

export class VoltronicAutoRS232Protocol implements VoltronicProtocol {
    protected readonly options: Readonly<Required<VoltronicAutoRS232ProtocolOptions>>;
    protected protocol?: VoltronicProtocol;

    constructor(
        options: Readonly<VoltronicAutoRS232ProtocolOptions> = {},
    ) {
        this.options = Object.setPrototypeOf(options, defaultOptions);
    }

    async execute(command: string, regex?: RegExp | undefined): Promise<string>;
    async execute(command: string, raw: true): Promise<Buffer>;
    async execute(command: string, option?: boolean | RegExp): Promise<string | Buffer> {
        const protocol = await this.createIfNotCreated();

        const raw = option === true;
        const regex = option instanceof RegExp ? option : undefined;

        try {
            if (raw) return await protocol.execute(command, true);
            else return await protocol.execute(command, regex);
        } catch (error) {
            protocol.destroy();
            delete this.protocol;
            throw error;
        }
    }

    destroy(): void {
        this.protocol?.destroy();
        delete this.protocol;
    }

    protected async getDevicePath(): Promise<string> {
        const ports = await SerialPort.list();
        const exclude = this.options.path === 'auto' ? this.options.exclude
            : [({ path }: PortInfo) => path !== this.options.path];

        const port = ports.find(port => !exclude.some(
            predicate => predicate(port)));

        if (!port) throw new NoRS232Port();
        return port.path;
    }

    protected async createIfNotCreated(): Promise<VoltronicProtocol> {
        const protocol = this.protocol ?? new VoltronicRS232Protocol(
            await this.getDevicePath(), this.options.rs232);

        this.protocol = protocol;
        return protocol;
    }
}