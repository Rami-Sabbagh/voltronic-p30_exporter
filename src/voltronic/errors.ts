
export class InvalidMessage extends Error { }

export class ChecksumMismatch extends InvalidMessage {
    constructor(expected: number, actual: number) {
        super('Checksum mismatched: ' +
            `expected 0x${expected.toString(16)}, ` +
            `got 0x${actual.toString(16)}.`)
    }
}

export class NegativeAcknowledgement extends Error {
    constructor() {
        super('Negative acknowledgment.');
    }
}

export class ValidationError extends Error { }

export class TimeoutError extends Error {
    constructor(public timeout: number) {
        super(`Timeout after ${timeout}ms.`);
    }
}

export class TooManyAttempts extends Error {
    constructor(public attempts?: number, message?: string) {
        super(message ?? `Failed after ${attempts} attempts.`);
    }
}

export class NoRS232Port extends Error {
    constructor() {
        super('No suitable RS232 port.');
    }
}
