import { Registry, Gauge, Counter } from 'prom-client';

const prefix: string = 'voltronic_io_';
export const register = new Registry();

export const metrics = {
    rs232: {
        execute_time: new Gauge({
            name: prefix + 'rs232_execute_seconds',
            help: 'RS232 execute() time.',
            registers: [register],
        }),

        execute_acquire: new Gauge({
            name: prefix + 'rs232_execute_acquire_seconds',
            help: 'Time spent while waiting for the connection to be free.',
            registers: [register],
        }),
    },

    errors: new Counter({
        name: prefix + 'errors_total',
        help: 'Errors raised (or at least constructed).',
        labelNames: ['type'] as const,
        registers: [register],
    }),
};