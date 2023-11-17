import { Mutex } from 'async-mutex';
import { VoltronicProtocol } from './structures';

export interface VoltronicCachedProtocolOptions {
    /**
     * Milliseconds to elapse before invalidating cached data.
     * Applied to all commands except those overridden in the `commandsTTL` field.
     */
    commonTTL?: number,

    /**
     * Overrides the `commonTTL` for specific commands.
     * Which is the milliseconds to elapse before invalidating cached data.
     */
    commandsTTL?: Readonly<Record<string, number>>,
}

const defaultOptions: Required<VoltronicCachedProtocolOptions> = {
    commonTTL: 5_000, // 5 Seconds.
    commandsTTL: {
        'QPI': 10 * 60 * 1_000, // Query Protocol ID   => 10 Minutes.
        'QID': 10 * 60 * 1_000, // Query Serial Number => 10 Minutes.
        'QMN': 10 * 60 * 1_000, // Query Model Name    => 10 Minutes.
    },
};

export class VoltronicCachedProtocol implements VoltronicProtocol {
    protected readonly options: Readonly<Required<VoltronicCachedProtocolOptions>>;
    protected mutex = new Mutex();

    protected rawCache: Record<string, { data: Buffer, timestamp: number } | undefined> = {};
    protected parsedCache: Record<string, { data: string, timestamp: number } | undefined> = {};
    protected errorsCache: Record<string, { error: unknown, timestamp: number } | undefined> = {};

    constructor(protected baseProtocol: VoltronicProtocol, options: VoltronicCachedProtocolOptions = {}) {
        this.options = Object.setPrototypeOf(options, defaultOptions);
    }

    async execute(command: string, regex?: RegExp | undefined): Promise<string>;
    async execute(command: string, raw: true): Promise<Buffer>;
    async execute(command: string, option?: boolean | RegExp): Promise<Buffer | string> {
        const raw = option === true;
        const regex = option instanceof RegExp ? option : undefined;

        return await this.mutex.runExclusive(async () => {
            const ttl = this.getCommandTTL(command);
            const expiry = Date.now() - ttl;

            const cachedError = this.errorsCache[command];
            if (cachedError && cachedError.timestamp > expiry)
                throw cachedError.error;
            else if (cachedError)
                delete this.errorsCache[command];

            const cached = (raw ? this.rawCache : this.parsedCache)[command];

            if (!cached || cached.timestamp <= expiry) {
                try {
                    if (raw) {
                        const data = await this.baseProtocol.execute(command, true);
                        this.rawCache[command] = { data, timestamp: Date.now() };
                        return data;
                    } else {
                        const data = await this.baseProtocol.execute(command, regex);
                        this.parsedCache[command] = { data, timestamp: Date.now() };
                        return data;
                    }
                } catch (error) {
                    this.errorsCache[command] = { error, timestamp: Date.now() };
                    throw error;
                }

            } else return cached.data;
        });
    }

    destroy(): void {
        this.baseProtocol.destroy();
    }

    protected getCommandTTL(command: string): number {
        return this.options.commandsTTL[command] ?? this.options.commonTTL;
    }
}