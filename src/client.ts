import { VoltronicAPI, VoltronicRS232Protocol } from './voltronic';

const protocol = new VoltronicRS232Protocol('COM4');
export const api = new VoltronicAPI(protocol);