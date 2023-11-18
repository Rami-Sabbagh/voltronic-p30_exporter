import { VoltronicAPI, VoltronicAutoRS232Protocol, VoltronicCachedProtocol, VoltronicRS232Protocol } from './voltronic';

// FIXME: Use proper configuration.
const rs232Protocol = new VoltronicAutoRS232Protocol({
    exclude: [
        ({ path }) => path.match(/^\/dev\/ttyS\d+$/) !== null,
    ],
});
const cachedProtocol = new VoltronicCachedProtocol(rs232Protocol);
export const api = new VoltronicAPI(cachedProtocol);