import { VoltronicAPI } from './voltronic';
import { VoltronicProtocol } from './voltronic/protocol';

const protocol = new VoltronicProtocol('COM4');
const api = new VoltronicAPI(protocol);

(async () => {
    console.log('Protocol:', await api.queryProtocolId());
    console.log('FW Version:', await api.queryFirmwareVersion());
    console.log('Serial:', await api.querySerialNumber());
    console.log('Model:', await api.queryModelName());
    console.log('Device Mode:', await api.queryDeviceMode());
    console.log('Parameters:', await api.queryGeneralStatusParameters());

    protocol.destroy();
})().catch(console.error).finally(() => protocol.destroy());
