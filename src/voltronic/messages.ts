import { crc16Xmodem } from './crc16-xmodem';
import { ChecksumMismatch, InvalidMessage } from './errors';

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
export function unpackMessage(data: Buffer): string;
export function unpackMessage(data: Buffer, raw: true): Buffer;
export function unpackMessage(data: Buffer, raw?: true): string | Buffer {
    if (data.at(-1) !== 0x0D) throw new InvalidMessage('Missing carriage return.');
    if (data.length < 4) throw new InvalidMessage('Data is too short to contain a message.');

    const expected = data.readUInt16BE(data.length - 3);
    const actual = crc16Xmodem(data.subarray(0, data.length - 3));

    if (expected !== actual)
        throw new ChecksumMismatch(expected, actual);
    
    if (raw) return data.subarray(0, data.length - 3);
    return data.toString('ascii', 0, data.length - 3);
}
