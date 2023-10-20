import { packMessage, unpackMessage } from './messages';

test.each([
    ['QPI', '51 50 49 be ac 0d'],
    ['VOLTRONICS', '56 4f 4c 54 52 4f 4e 49 43 53 6c 3e 0d'],
    ['#$!@-,;:[]/', '23 24 21 40 2d 2c 3b 3a 5b 5d 2f e1 a2 0d']
])('packMessage("%s") is [%s]', (message: string, hex: string) => {
    const expected = Buffer.from(hex.replaceAll(' ', ''), 'hex');
    const actual = packMessage(message);

    expect(actual).toStrictEqual(expected);
});

test.each([
    ['51 50 49 BE AC 0D', 'QPI'],
    ['56 4f 4c 54 52 4f 4e 49 43 53 6c 3e 0d', 'VOLTRONICS'],
    ['23 24 21 40 2d 2c 3b 3a 5b 5d 2f e1 a2 0d', '#$!@-,;:[]/'],
])('unpackMessage([%s]) is "%s"', (hex: string, message: string) => {
    const data = Buffer.from(hex.replaceAll(' ', ''), 'hex');
    const actual = unpackMessage(data);

    expect(actual).toStrictEqual(message);
});

test('Checksum fails with a missing byte', () => {
    const hex = '50 49 BE AC 0D' // QPI but missing the first byte.
    const data = Buffer.from(hex.replaceAll(' ', ''), 'hex');
    
    expect(() => unpackMessage(data)).toThrow(/^Checksum mismatch:/g);
});

test('Checksum fails with a corrupted byte', () => {
    const hex = '51 B9 49 BE AC 0D' // QPI but with P messed up.
    const data = Buffer.from(hex.replaceAll(' ', ''), 'hex');
    
    expect(() => unpackMessage(data)).toThrow(/^Checksum mismatch:/g);
});

test('Missing carriage return is rejected', () => {
    const hex = '51 50 49 BE AC' // QPI missing the carriage return.
    const data = Buffer.from(hex.replaceAll(' ', ''), 'hex');
    
    expect(() => unpackMessage(data)).toThrow('Missing carriage return.');
});

test.each([
    ['0D'],
    ['AC 0D'],
    ['BE AC 0D'],
])('[%s] is rejected for being too short', (hex: string) => {
    const data = Buffer.from(hex.replaceAll(' ', ''), 'hex');
    expect(() => unpackMessage(data)).toThrow('Data is too short to contain a message.');
});

test.each([
    ['Hello World!'],
    ['The Little Quick Brown Fox Jumps Over The Lazy Dog.'],
])('"%s" packs, unpacks and repacks as expected', (message: string) => {
    const packed = packMessage(message);
    expect(packed).toMatchSnapshot();

    const unpacked = unpackMessage(packed);
    expect(unpacked).toStrictEqual(message);

    const repacked = packMessage(unpacked);
    expect(repacked).toStrictEqual(packed);
});

test('Leading "(" is not stripped', () => {
    const packed = packMessage('(ACK');
    const unpacked = unpackMessage(packed);
    expect(unpacked).toStrictEqual('(ACK');
});
