import { Either, Schema, SupportedSchema } from './utils';
export declare const notAArray: (input: Array<unknown>) => {
    schema: "array";
    code: "E_NOT_A_ARRAY";
    message: string;
    details: {
        provided: {
            type: string;
            value: unknown[];
        };
        expected: {
            type: string;
        };
    };
};
export declare type NotAArrayError = ReturnType<typeof notAArray>;
declare type ArrayFailure<WrappedSchema extends SupportedSchema, C extends Constraint = never> = {
    errors: Array<NotAArrayError | ReturnType<C['error']>>;
    items: Array<Either<WrappedSchema['O'], WrappedSchema['E']>>;
};
declare type ArrayOverload = {
    <WrappedSchema extends SupportedSchema, C extends Constraint>(wrappedSchema: WrappedSchema, constraints: Array<C>): Schema<Array<WrappedSchema['I']>, Array<WrappedSchema['O']>, ArrayFailure<WrappedSchema, C>>;
    <WrappedSchema extends SupportedSchema>(wrappedSchema: WrappedSchema): Schema<Array<WrappedSchema['I']>, Array<WrappedSchema['O']>, ArrayFailure<WrappedSchema>>;
};
export declare const array: ArrayOverload;
export declare const arrayConstraint: <I, C extends string, T>({ when, error, }: {
    when: (input: I[]) => boolean;
    error: (input: I[]) => {
        code: C;
        message: string;
        details: T;
    };
}) => {
    when: (input: I[]) => boolean;
    error: (input: I[]) => {
        schema: "array";
        code: C;
        message: string;
        details: {
            provided: {
                type: string;
                value: I[];
            };
            constraint: T;
        };
    };
};
declare type Constraint = ReturnType<typeof arrayConstraint>;
export {};
