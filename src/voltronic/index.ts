import { VoltronicProtocol } from './protocol';
import { GeneralStatusParameters, deviceFlagsList, deviceStatusFlagsList, generalStatusParametersKeys } from './structures';
import { parseFlags } from './utilities';

export class VoltronicAPI {
    protocol: VoltronicProtocol;

    constructor(protocol: VoltronicProtocol) {
        this.protocol = protocol;
    }

    async queryProtocolId(): Promise<string> {
        return this.protocol.execute('QPIGS');
    }

    // async queryDeviceSerialNumber(): Promise<string> {
        //return this.protocol.execute('QPIGS');
    // }

    async queryFirmwareVersion(): Promise<string> {
        return this.protocol.execute('QVFW');
    }

    async queryModelName(): Promise<string> {
        return this.protocol.execute('QMN');
    }

    // FIXME: Use an enum.
    async queryDeviceMode(): Promise<string> {
        return this.protocol.execute('QMOD');
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