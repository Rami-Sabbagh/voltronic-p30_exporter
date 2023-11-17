import { VoltronicAPI, VoltronicRS232Protocol } from './voltronic';

const protocol = new VoltronicRS232Protocol('COM4');
const api = new VoltronicAPI(protocol);

(async () => {
    console.info('Program started!');

    console.log('Protocol:', await api.queryProtocolId().catch((error) => `ERR: ${error}`));
    console.log('FW Version:', await api.queryFirmwareVersion().catch((error) => `ERR: ${error}`));
    console.log('Serial:', await api.querySerialNumber().catch((error) => `ERR: ${error}`));
    console.log('Model:', await api.queryModelName().catch((error) => `ERR: ${error}`));
    console.log('Device Mode:', await api.queryDeviceMode().catch((error) => `ERR: ${error}`));
    console.log('Parameters:', await api.queryGeneralStatusParameters().catch((error) => `ERR: ${error}`));

    protocol.destroy();
})().catch(console.error).finally(() => protocol.destroy());
