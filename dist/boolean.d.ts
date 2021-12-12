import { Schema } from './utils';
declare const booleanError: (input: unknown) => {
    schema: "boolean";
    code: "E_NOT_A_BOOLEAN";
    message: string;
    details: {
        provided: {
            type: string;
            value: unknown;
        };
        expected: {
            type: string;
        };
    };
};
declare type BooleanError = ReturnType<typeof booleanError>;
export declare const boolean: () => Schema<boolean, boolean, BooleanError>;
export {};
