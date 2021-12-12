import { Schema } from './utils';
declare const numberError: (input: unknown) => {
    schema: "number";
    code: "E_NOT_A_NUMBER";
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
declare type NumberError = ReturnType<typeof numberError>;
declare type NumberOverload = {
    <C extends Constraint>(constraints: Array<C>): Schema<number, number, Array<NumberError | ReturnType<C['error']>>>;
    (): Schema<number, number, Array<NumberError>>;
};
export declare const number: NumberOverload;
export declare const numberConstraint: <I extends number, C extends string, T>({ when, error, }: {
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
declare type Constraint = ReturnType<typeof numberConstraint>;
export {};
