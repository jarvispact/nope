import { Schema } from './utils';
declare const notADateError: (input: unknown) => {
    schema: "date";
    code: "E_NOT_A_DATE";
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
declare type NotADateError = ReturnType<typeof notADateError>;
declare const invalidDateError: (input: unknown) => {
    schema: "date";
    code: "E_INVALID_DATE";
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
declare type InvalidDateError = ReturnType<typeof invalidDateError>;
declare type DateError = NotADateError | InvalidDateError;
declare type DateOverload = {
    <C extends Constraint>(constraints: Array<C>): Schema<Date, Date, Array<DateError | ReturnType<C['error']>>>;
    (): Schema<Date, Date, Array<DateError>>;
};
export declare const date: DateOverload;
export declare const dateConstraint: <I extends Date, C extends string, T>({ when, error, }: {
    when: (input: I) => boolean;
    error: (input: I) => {
        code: C;
        message: string;
        details?: T | undefined;
    };
}) => {
    when: (input: I) => boolean;
    error: (input: I) => {
        code: C;
        message: string;
        details?: T | undefined;
    };
};
declare type Constraint = ReturnType<typeof dateConstraint>;
export {};
