import { crc16_xmodem } from './crc16-xmodem';

test.each([
    ['QPI', '0xBEAC'],
    ['VOLTRONICS', '0x6C3E'],
    ['#$!@-,;:[]/', '0xE1A2'],
])('crc_xmodem("%s") == %s', (message: string, crc: string) => {
    const data = Buffer.from(message, 'ascii');
    expect(crc16_xmodem(data)).toBe(Number.parseInt(crc, 16));
});