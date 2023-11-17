import { VoltronicAPI } from './voltronic';
import { VoltronicProtocol } from './voltronic/protocol';

const protocol = new VoltronicProtocol('COM4');
export const api = new VoltronicAPI(protocol);