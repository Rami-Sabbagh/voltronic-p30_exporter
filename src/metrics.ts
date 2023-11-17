import { collectDefaultMetrics, Registry, Gauge } from 'prom-client';

import { api } from './client';
import { DeviceMode } from './voltronic';

const prefix: string = 'voltronic_';
export const register = new Registry();

// Device Mode
{
    new Gauge({
        name: prefix + 'device_mode',
        help: 'Device Mode',
        labelNames: ['mode'] as const,
        registers: [register],
        async collect() {
            const activeMode = await api.queryDeviceMode();
            const modes = Object.values(DeviceMode);

            for (const mode of modes)
                this.set({ mode }, mode === activeMode ? 1 : 0);
        },
    });
}

// General Status Parameters
{
    {
        new Gauge({
            name: prefix + 'ac_volts',
            help: 'AC Voltage (V)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.acVoltage);
            },
        });

        new Gauge({
            name: prefix + 'ac_hertz',
            help: 'AC Frequency (Hz)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.acFrequency);
            }
        });
    }

    {
        new Gauge({
            name: prefix + 'output_volts',
            help: 'Output Voltage (V)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.outputVoltage);
            },
        });

        new Gauge({
            name: prefix + 'output_hertz',
            help: 'Output Frequency (Hz)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.outputFrequency);
            },
        });
    }

    {
        new Gauge({
            name: prefix + 'output_apparent_watts',
            help: 'Output Apparent Power (W)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.outputApparentPower);
            },
        });

        new Gauge({
            name: prefix + 'output_active_watts',
            help: 'Output Active Power (W)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.outputActivePower);
            },
        });
    }

    new Gauge({
        name: prefix + 'output_load_rate',
        help: 'Output Load (%)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.outputLoad / 100);
        },
    });

    {
        new Gauge({
            name: prefix + 'bus_volts',
            help: 'Bus Voltage (V)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.busVoltage);
            },
        });

        new Gauge({
            name: prefix + 'battery_volts',
            help: 'Battery Voltage (V)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.batteryVoltage);
            },
        });
    }

    new Gauge({
        name: prefix + 'charging_amperes',
        help: 'Charging Current (A)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.chargingCurrent);
        },
    });

    new Gauge({
        name: prefix + 'battery_capacity_rate',
        help: 'Battery Capacity (%)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.batteryCapacity / 100);
        },
    });

    new Gauge({
        name: prefix + 'heatsink_celsius',
        help: 'Heatsink Temperature (celsius)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.heatsinkTemperature);
        },
    });

    {
        new Gauge({
            name: prefix + 'pv_input_amperes',
            help: 'PV Input Current (A)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.pvInputCurrent);
            },
        });

        new Gauge({
            name: prefix + 'pv_input_volts',
            help: 'PV Input Voltage (V)',
            registers: [register],
            async collect() {
                const params = await api.queryGeneralStatusParameters();
                this.set(params.pvInputVoltage);
            },
        });
    }

    new Gauge({
        name: prefix + 'battery_from_scc_volts',
        help: 'Battery Voltage from SCC (V)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.batteryVoltageFromSCC);
        },
    });

    new Gauge({
        name: prefix + 'battery_discharge_amperes',
        help: 'Battery Discharge Current (A)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.batteryDischargeCurrent);
        },
    });

    new Gauge({
        name: prefix + 'device_status',
        help: 'Device Status (Flags)',
        labelNames: ['flag'] as const,
        registers: [register],
        async collect() {
            const { deviceStatus } = await api.queryGeneralStatusParameters();

            for (const [flag, value] of Object.entries(deviceStatus))
                this.set({ flag }, value ? 1 : 0);
        },
    });

    new Gauge({
        name: prefix + 'battery_fans_on_offset_volts',
        help: 'Battery Voltage Offset For Fans On (originally 10mV, converted to V)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.batteryVoltageOffsetForFansOn / 100);
        },
    });

    new Gauge({
        name: prefix + 'eeprom_version',
        help: 'EEPROM Version',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.eepromVersion);
        },
    });

    new Gauge({
        name: prefix + 'pv_charging_watts',
        help: 'PV Charging Power (W)',
        registers: [register],
        async collect() {
            const params = await api.queryGeneralStatusParameters();
            this.set(params.pvChargingPower);
        },
    });

    new Gauge({
        name: prefix + 'device_flags',
        help: 'Device Flags (Flags)',
        labelNames: ['flag'] as const,
        registers: [register],
        async collect() {
            const { deviceFlags } = await api.queryGeneralStatusParameters();

            for (const [flag, value] of Object.entries(deviceFlags))
                this.set({ flag }, value ? 1 : 0);
        },
    });
}

collectDefaultMetrics({ register });