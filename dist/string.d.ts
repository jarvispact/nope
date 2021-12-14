import { Schema } from './utils';
declare const stringError: (input: unknown) => {
    schema: "string";
    code: "E_NOT_A_STRING";
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
declare type StringError = ReturnType<typeof stringError>;
declare type StringOverload = {
    <C extends Constraint>(constraints: Array<C>): Schema<string, string, Array<StringError | ReturnType<C['error']>>>;
    (): Schema<string, string, Array<StringError>>;
};
export declare const string: StringOverload;
export declare const stringConstraint: <I extends string, C extends string, T>({ when, error, }: {
    when: (input: I) => boolean;
    error: (input: I) => {
        code: C;
        message: string;
        details?: T | undefined;
    };
}) => {
    when: (input: I) => boolean;
    error: (input: I) => {
        schema: "string";
        code: C;
        message: string;
        details: {
            provided: {
                type: string;
                value: I;
            };
            constraint: T | undefined;
        };
    };
};
declare type Constraint = ReturnType<typeof stringConstraint>;
export {};
