import { VoltronicAPI, VoltronicCachedProtocol, VoltronicRS232Protocol } from './voltronic';

const rs232Protocol = new VoltronicRS232Protocol('COM4');
const cachedProtocol = new VoltronicCachedProtocol(rs232Protocol);
export const api = new VoltronicAPI(cachedProtocol);