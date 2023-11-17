import { VoltronicAPI, VoltronicAutoRS232Protocol, VoltronicCachedProtocol, VoltronicRS232Protocol } from './voltronic';

const rs232Protocol = new VoltronicAutoRS232Protocol('COM4');
const cachedProtocol = new VoltronicCachedProtocol(rs232Protocol);
export const api = new VoltronicAPI(cachedProtocol);