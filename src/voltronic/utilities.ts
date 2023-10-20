export async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseFlags(bitField: string, flagsList: string[]): Record<string, boolean> {
    return Object.fromEntries(flagsList.map((key, index) =>
        [key, bitField[index] === '1']));
}