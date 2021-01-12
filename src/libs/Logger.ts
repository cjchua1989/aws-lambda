import { inspect } from 'util';

export class Logger {
    static error(name: string, payload: unknown): void {
        console.error(name, inspect(payload, { depth: null }));
    }

    static info(name: string, payload: unknown): void {
        console.info(name, inspect(payload, { depth: null }));
    }

    static debug(name: string, payload: unknown): void {
        console.debug(name, inspect(payload, { depth: null }));
    }
}
