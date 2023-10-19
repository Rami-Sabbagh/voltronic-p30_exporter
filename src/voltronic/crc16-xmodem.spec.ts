import { crc16Xmodem } from './crc16-xmodem';

test.each([
    ['QPI', '0xBEAC'],
    ['VOLTRONICS', '0x6C3E'],
    ['#$!@-,;:[]/', '0xE1A2'],
])('crc16Xmodem("%s") == %s', (message: string, crc: string) => {
    const data = Buffer.from(message, 'ascii');
    expect(crc16Xmodem(data)).toBe(Number.parseInt(crc, 16));
});