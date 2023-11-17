export interface GeneralStatusParameters {
    /**
     * AC Voltage (V)
    */
    acVoltage: number,
    /**
     * AC Frequency (Hz)
     */
    acFrequency: number,
    /**
     * Output Voltage (V)
     */
    outputVoltage: number,
    /**
     * Output Frequency (Hz)
     */
    outputFrequency: number,
    /**
     * Output Apparent Power (W)
     */
    outputApparentPower: number,
    /**
     * Output Active Power (W)
     */
    outputActivePower: number,
    /**
     * Output Load (%)
    */
    outputLoad: number,
    /**
     * Bus Voltage (V)
     */
    busVoltage: number,
    /**
     * Battery Voltage (V)
     */
    batteryVoltage: number,
    /**
     * Charging Current (A)
     */
    chargingCurrent: number,
    /**
     * Battery Capacity (%)
     */
    batteryCapacity: number,
    /**
     * Heatsink Temperature (°C)
     */
    heatsinkTemperature: number,
    /**
     * PV Input Current (A)
     */
    pvInputCurrent: number,
    /**
     * PV Input Voltage (V)
     */
    pvInputVoltage: number,
    /**
     * Battery Voltage From SCC (V)
    */
    batteryVoltageFromSCC: number,
    /**
     * Battery Discharge Current (A)
     */
    batteryDischargeCurrent: number,
    /**
     * Device Status (Flags)
     */
    deviceStatus: DeviceStatusFlags,
    /**
     * Battery Voltage Offest For Fans On (10mV)
     */
    batteryVoltageOffsetForFansOn: number,
    /**
     * EEPROM Version
     */
    eepromVersion: number,
    /**
     * PV Charging Power (W)
    */
    pvChargingPower: number,
    /**
     * Device Flags (Flags)
     */
    deviceFlags: DeviceFlags,
}

export const generalStatusParametersKeys = [
    'acVoltage',
    'acFrequency',
    'outputVoltage',
    'outputFrequency',
    'outputApparentPower',
    'outputActivePower',
    'outputLoad',
    'busVoltage',
    'batteryVoltage',
    'chargingCurrent',
    'batteryCapacity',
    'heatsinkTemperature',
    'pvInputCurrent',
    'pvInputVoltage',
    'batteryVoltageFromSCC',
    'batteryDischargeCurrent',
    'deviceStatus',
    'batteryVoltageOffsetForFansOn',
    'eepromVersion',
    'pvChargingPower',
    'deviceFlags',
];

export interface DeviceStatusFlags {
    /**
     * SBU Priority Version
     */
    sbuPriorityVersion: boolean,
    /**
     * Configuration Changed
     */
    configurationChanged: boolean,
    /**
     * Solar Firmware Version Changed
     */
    solarFirmwareVersionChanged: boolean,
    /**
     * Has Load
     */
    hasLoad: boolean,
    /**
     * Steady Battery Voltage While Charging
     */
    steadyBatteryVoltageWhileCharging: boolean,
    /**
     * Charge On
     */
    chargeOn: boolean,
    /**
     * Solar Charge On
     */
    solarChargeOn: boolean,
    /**
     * Utility Charge On
     */
    utilityChargeOn: boolean,
}

export const deviceStatusFlagsList = [
    'sbuPriorityVersion',
    'configurationChanged',
    'solarFirmwareVersionChanged',
    'hasLoad',
    'steadyBatteryVoltageWhileCharging',
    'chargeOn',
    'solarChargeOn',
    'utilityChargeOn',
];

export interface DeviceFlags {
    /**
     * Charging To Floating Mode
     */
    chargingToFloatingMode: boolean,
    /**
     * Switch On
     */
    switchOn: boolean,
    /**
     * Dustproof Installed
     */
    dustproofInstalled: boolean,
}

export const deviceFlagsList = [
    'chargingToFloatingMode',
    'switchOn',
    'dustproofInstalled',
];

export enum DeviceMode {
    /**
     * Power On Mode
     */
    POWER_ON = 'P',
    /**
     * Standby Mode
     */
    STAND_BY = 'S',
    /**
     * Bypass Mode
     */
    BYPASS = 'Y',
    /**
     * Line Mode
     */
    LINE = 'L',
    /**
     * Battery Mode
     */
    BATTERY = 'B',
    /**
     * Battery Test Mode
     */
    BATTERY_TEST = 'BT',
    /**
     * Fault Mode
     */
    FAULT = 'F',
    /**
     * Shutdown Mode
     */
    SHUTDOWN = 'D',
    /**
     * Grid Mode
     */
    GRID = 'G',
    /**
     * Charge Mode
     */
    CHARGE = 'C',
}
