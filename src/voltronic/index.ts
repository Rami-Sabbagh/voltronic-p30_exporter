import { VoltronicProtocol } from './structures';
import { DeviceMode, GeneralStatusParameters, deviceFlagsList, deviceStatusFlagsList, generalStatusParametersKeys } from './data-model';
import { parseFlags } from './utilities';

export * from './data-model';
export * from './protocol/rs232';
export * from './protocol/cached';

export class VoltronicAPI {
    protocol: VoltronicProtocol;

    constructor(protocol: VoltronicProtocol) {
        this.protocol = protocol;
    }

    async queryProtocolId(): Promise<string> {
        return this.protocol.execute('QPI', /^\S+$/);
    }

    async querySerialNumber(): Promise<string> {
        const rawSerial = await this.protocol.execute('QID', true);
        return rawSerial.toString('hex').toUpperCase();
    }

    async queryFirmwareVersion(): Promise<string> {
        return this.protocol.execute('QVFW', /^VERFW:\d{5}\.\d{2}$/);
    }

    async queryModelName(): Promise<string> {
        return this.protocol.execute('QMN', /^\S+$/);
    }

    async queryDeviceMode(): Promise<DeviceMode> {
        const result = await this.protocol.execute('QMOD', /^[A-Z]{1,2}$/) as unknown as DeviceMode;
        if (Object.values(DeviceMode).indexOf(result) === -1)
            throw `Unknown mode (${result})!`;

        return result;
    }

    async queryGeneralStatusParameters(): Promise<GeneralStatusParameters> {
        const response = await this.protocol.execute('QPIGS', /^[\d\.]+(?: [\d\.]+){20}$/);
        const entries = response.split(' ').map((rawValue, index) => {
            const key = generalStatusParametersKeys[index];

            let parsedValue: number | Record<string, boolean>;

            if (key === 'deviceStatus' || key === 'deviceFlags')
                parsedValue = parseFlags(rawValue, key === 'deviceStatus'
                    ? deviceStatusFlagsList : deviceFlagsList);
            else
                parsedValue = Number.parseFloat(rawValue);

            return [key, parsedValue];
        });

        return Object.fromEntries(entries);
    }
}