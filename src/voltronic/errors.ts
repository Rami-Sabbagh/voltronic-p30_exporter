import { metrics } from './metrics';

export class VoltronicError extends Error {
    constructor(
        public readonly type: string,
        message: string,
    ) {
        super(message);
        metrics.errors.inc({ type });
    }
}

export class InvalidMessage extends VoltronicError {
    constructor(message: string) {
        super('INVALID', message);
    }
}

export class ChecksumMismatch extends VoltronicError {
    constructor(expected: number, actual: number) {
        super('CHECKSUM_MISMATCH', 'Checksum mismatched: ' +
            `expected 0x${expected.toString(16)}, ` +
            `got 0x${actual.toString(16)}.`)
    }
}

export class NegativeAcknowledgement extends VoltronicError {
    constructor() {
        super('NAK', 'Negative acknowledgment.');
    }
}

export class ValidationError extends VoltronicError {
    constructor(message: string) {
        super('VALIDATION_FAILURE', message);
    }
}

export class TimeoutError extends VoltronicError {
    constructor(public timeout: number) {
        super('TIMEOUT', `Timeout after ${timeout}ms.`);
    }
}

export class TooManyAttempts extends VoltronicError {
    constructor(public attempts?: number, message?: string) {
        super('TOO_MANY_ATTEMPTS', message ?? `Failed after ${attempts} attempts.`);
    }
}

export class NoRS232Port extends VoltronicError {
    constructor() {
        super('NO_RS232_PORT', 'No suitable RS232 port.');
    }
}
