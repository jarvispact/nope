import { SchemaType } from './internal-utils';
export declare type Success<T> = {
    status: 'SUCCESS';
    value: T;
};
export declare type Failure<T> = {
    status: 'FAILURE';
    value: T;
};
export declare type Either<S, F> = Success<S> | Failure<F>;
export declare const success: <T>(v: T) => Success<T>;
export declare const failure: <T>(v: T) => Failure<T>;
export declare const isSuccess: <S, F>(either: Either<S, F>) => either is Success<S>;
export declare const isFailure: <S, F>(either: Either<S, F>) => either is Failure<F>;
export declare const valueOf: <S, F>(either: Either<S, F>) => S | F;
export declare const fold: <S, F, OnSuccess, OnFailure>(either: Either<S, F>, { onSuccess, onFailure, }: {
    onSuccess: (value: S) => OnSuccess;
    onFailure: (value: F) => OnFailure;
}) => OnSuccess | OnFailure;
export declare type Schema<I, O extends I, E> = {
    schema: SchemaType;
    I: I;
    O: O;
    E: E;
    validate: (v: I) => Either<O, E>;
};
export declare type RecordSchema<I, O extends I, E, Def extends {
    [Key: string]: Schema<any, any, any>;
} = {
    [Key: string]: Schema<any, any, any>;
}> = Schema<I, O, E> & {
    definition: Def;
};
export declare type LiteralSchema<I, O extends I, E, Literal> = Schema<I, O, E> & {
    literal: Literal;
};
export declare type SupportedSchema = Schema<any, any, any> | LiteralSchema<any, any, any, any> | RecordSchema<any, any, any>;
export declare const isLiteralSchema: (schema: SupportedSchema) => schema is LiteralSchema<any, any, any, any>;
export declare const isRecordSchema: (schema: SupportedSchema) => schema is RecordSchema<any, any, any, {
    [Key: string]: Schema<any, any, any>;
}>;
