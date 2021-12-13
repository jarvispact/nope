/* eslint-disable @typescript-eslint/no-explicit-any */
import { SchemaType } from './internal-utils';

export type Success<T> = { status: 'SUCCESS'; value: T };
export type Failure<T> = { status: 'FAILURE'; value: T };
export type Either<S, F> = Success<S> | Failure<F>;

export const success = <T>(v: T): Success<T> => {
    return {
        status: 'SUCCESS',
        value: v,
    };
};

export const failure = <T>(v: T): Failure<T> => {
    return {
        status: 'FAILURE',
        value: v,
    };
};

export const isSuccess = <S, F>(either: Either<S, F>): either is Success<S> =>
    either.status === 'SUCCESS';

export const isFailure = <S, F>(either: Either<S, F>): either is Failure<F> =>
    either.status === 'FAILURE';

export const valueOf = <S, F>(either: Either<S, F>) => either.value;

export const fold = <S, F, OnSuccess, OnFailure>(
    either: Either<S, F>,
    {
        onSuccess,
        onFailure,
    }: {
        onSuccess: (value: S) => OnSuccess;
        onFailure: (value: F) => OnFailure;
    },
) => (isSuccess(either) ? onSuccess(either.value) : onFailure(either.value));

export type Schema<I, O extends I, E> = {
    schema: SchemaType;
    I: I;
    O: O;
    E: E;
    validate: (v: I) => Either<O, E>;
};

export type RecordSchema<
    I,
    O extends I,
    E,
    Def extends { [Key: string]: Schema<any, any, any> } = {
        [Key: string]: Schema<any, any, any>;
    },
> = Schema<I, O, E> & { definition: Def };

export type LiteralSchema<I, O extends I, E, Literal> = Schema<I, O, E> & {
    literal: Literal;
};

export type SupportedSchema =
    | Schema<any, any, any>
    | LiteralSchema<any, any, any, any>
    | RecordSchema<any, any, any>;

export const isLiteralSchema = (
    schema: SupportedSchema,
): schema is LiteralSchema<any, any, any, any> =>
    schema.schema === 'string-literal' || schema.schema === 'number-literal';

export const isRecordSchema = (
    schema: SupportedSchema,
): schema is RecordSchema<any, any, any> => schema.schema === 'record';
