/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createError,
    Either,
    Failure,
    failure,
    isFailure,
    isObject,
    isSuccess,
    objectKeys,
    Opaque,
    Schema,
    schema,
    SchemaError,
    Success,
    success,
} from './utils';

export const stringSchema = schema<
    'string',
    string,
    string,
    SchemaError<'string', 'E_STRING'>
>({
    uri: 'string',
    is: (input) => typeof input === 'string',
    validate: (input, { uri, is }) =>
        is(input)
            ? success(input)
            : failure(
                  createError(
                      uri,
                      'E_STRING',
                      `input: "${input}" is not of type string`,
                  ),
              ),
});

export type Email = Opaque<string, 'Email'>;

export const emailSchema = schema<
    'email',
    string,
    Email,
    SchemaError<'email', 'E_EMAIL'>
>({
    uri: 'email',
    is: (input) => stringSchema.is(input) && input.includes('@'),
    validate: (input, { uri, is }) =>
        is(input)
            ? success(input)
            : failure(
                  createError(
                      uri,
                      'E_EMAIL',
                      `input: "${input}" is not of type email`,
                  ),
              ),
});

type ArraySchemaError<ItemSchema extends Schema<any, any, any, any>> = {
    error: SchemaError<'array', 'E_ARRAY'> | null;
    items: Either<ItemSchema['O'], ItemSchema['E']>[];
};

type ArraySchema<ItemSchema extends Schema<any, any, any, any>> = {
    uri: 'array';
    I: ItemSchema['I'][];
    O: ItemSchema['O'][];
    E: ArraySchemaError<ItemSchema>;
    is: (input: ItemSchema['I'][]) => input is ItemSchema['O'][];
    validate: (
        input: ItemSchema['I'][],
    ) => Either<ItemSchema['O'][], ArraySchemaError<ItemSchema>>;
};

export const arraySchema = <ItemSchema extends Schema<any, any, any, any>>(
    itemSchema: ItemSchema,
): ArraySchema<ItemSchema> => {
    const _schema = schema<
        'array',
        ItemSchema['I'][],
        ItemSchema['O'][],
        ArraySchemaError<ItemSchema>
    >({
        uri: 'array',
        is: (arrayInput) =>
            Array.isArray(arrayInput) ? arrayInput.every(itemSchema.is) : false,
        validate: (arrayInput, { uri, is }) => {
            if (is(arrayInput)) return success(arrayInput);
            if (!Array.isArray(arrayInput))
                return failure({
                    error: createError(
                        uri,
                        'E_ARRAY',
                        `input: "${arrayInput}" is not of type array`,
                    ),
                    items: [],
                });
            return failure({
                error: null,
                items: arrayInput.map(itemSchema.validate),
            });
        },
    });

    return {
        ..._schema,
    };
};

type RecordSchemaError<
    Definition extends {
        [Key: string]: Schema<any, any, any, any>;
    },
> = {
    error: SchemaError<'record', 'E_RECORD'> | null;
    properties: {
        [K in keyof Definition]: Either<Definition[K]['O'], Definition[K]['E']>;
    };
};

type RemoveNull<T> = T extends null ? never : T;

type ObjectValues<T extends { [K: string]: any }> = T[keyof T][];
type F = ObjectValues<{ firstname: string; age: number }>;

// try to use a Object.values approach with conditionals

type TakeFailure<T extends Either<any, any>> = T extends Success<T['value']>
    ? never
    : T['value'];

type RecordSchema<
    Definition extends {
        [Key: string]: Schema<any, any, any, any>;
    },
> = {
    uri: 'record';
    I: { [K in keyof Definition]: Definition[K]['I'] };
    O: { [K in keyof Definition]: Definition[K]['O'] };
    E: RecordSchemaError<Definition>;
    is: (input: { [K in keyof Definition]: Definition[K]['I'] }) => input is {
        [K in keyof Definition]: Definition[K]['O'];
    };
    validate: (input: {
        [K in keyof Definition]: Definition[K]['I'];
    }) => Either<
        { [K in keyof Definition]: Definition[K]['O'] },
        RecordSchemaError<Definition>
    >;
    collectErrors: (
        failure: Failure<RecordSchemaError<Definition>>,
    ) => (
        | RemoveNull<RecordSchemaError<Definition>['error']>
        | TakeFailure<
              RecordSchemaError<Definition>['properties'][keyof RecordSchemaError<Definition>['properties']]
          >
    )[];
};

export const recordSchema = <
    Definition extends {
        [Key: string]: Schema<any, any, any, any>;
    },
>(
    definition: Definition,
): RecordSchema<Definition> => {
    type Properties = {
        [K in keyof Definition]: Either<Definition[K]['O'], Definition[K]['E']>;
    };

    const _schema = schema<
        'record',
        { [K in keyof Definition]: Definition[K]['I'] },
        { [K in keyof Definition]: Definition[K]['O'] },
        RecordSchemaError<Definition>
    >({
        uri: 'record',
        is: (input) =>
            isObject(input) &&
            objectKeys(definition).every((defKey) =>
                definition[defKey].is(input[defKey]),
            ),
        validate: (input, { uri, is }) => {
            if (is(input)) return success(input);
            if (!isObject(input))
                return failure({
                    error: createError(
                        uri,
                        'E_RECORD',
                        `input: "${input}" is not of type record`,
                    ),
                    properties: {} as Properties,
                });
            return failure({
                error: null,
                properties: objectKeys(definition).reduce((accum, defKey) => {
                    accum[defKey] = definition[defKey].validate(input[defKey]);
                    return accum;
                }, {} as Properties),
            });
        },
    });

    return {
        ..._schema,
        collectErrors: () => null as any,
    };
};
