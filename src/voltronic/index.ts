import { VoltronicProtocol } from './protocol';
import { DeviceMode, GeneralStatusParameters, deviceFlagsList, deviceStatusFlagsList, generalStatusParametersKeys } from './structures';
import { parseFlags } from './utilities';

export class VoltronicAPI {
    protocol: VoltronicProtocol;

    constructor(protocol: VoltronicProtocol) {
        this.protocol = protocol;
    }

    async queryProtocolId(): Promise<string> {
        return this.protocol.execute('QPI');
    }

    async querySerialNumber(): Promise<string> {
        const rawSerial = await this.protocol.execute('QID', true);
        return rawSerial.toString('hex').toUpperCase();
    }

    async queryFirmwareVersion(): Promise<string> {
        return this.protocol.execute('QVFW');
    }

    async queryModelName(): Promise<string> {
        return this.protocol.execute('QMN');
    }

    async queryDeviceMode(): Promise<DeviceMode> {
        const result = await this.protocol.execute('QMOD') as unknown as DeviceMode;
        if (Object.values(DeviceMode).indexOf(result) === -1)
            throw `Unknown mode (${result})!`;

        return result;
    }

    async queryGeneralStatusParameters(): Promise<GeneralStatusParameters> {
        const response = await this.protocol.execute('QPIGS');
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