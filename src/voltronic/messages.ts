import { crc16Xmodem } from './crc16-xmodem';

/**
 * Packs the message into the transmission ready format of voltronics.
 * 
 * Calculates the checksum of the message and appends it to the end of the message
 * alongside a carriage return as specified by the protocol.
 */
export function packMessage(message: string): Buffer {
    const result = Buffer.alloc(message.length + 3);
    result.write(message, 'ascii');

    const checksum = crc16Xmodem(result.subarray(0, -3));
    result.writeUInt16BE(checksum, message.length);
    result.write('\r', result.length - 1, 'ascii');

    return result;
}

/**
 * Unpack the message from the transmitted format.
 * 
 * Validates the checksum and strips it alongside the carriage return from the
 * message as specified by the protocol.
 * 
 * Also removes the first character from the message if it was `(`.
 */
export function unpackMessage(data: Buffer): string {
    if (data.at(-1) !== 0x0D) throw 'Missing carriage return.';
    if (data.length < 4) throw 'Data is too short to contain a message.';

    const expected = data.readUInt16BE(data.length - 3);
    const actual = crc16Xmodem(data.subarray(0, data.length - 3));

    if (expected !== actual)
        throw 'Checksum mismatch: ' +
            `expected 0x${expected.toString(16)}, ` +
            `got 0x${actual.toString(16)}.`;

    return data.toString('ascii',
        data.at(0) === 0x28 ? 1 : 0, // '(' character.
        data.length - 3);
}
