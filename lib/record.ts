/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArraySchemaError } from './array';
import {
    createError,
    Either,
    Failure,
    failure,
    isObject,
    objectKeys,
    Schema,
    schema,
    SchemaError,
    Success,
    success,
} from './utils';

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

type TakeFailure<T extends Either<any, any>> = T extends Success<T['value']>
    ? never
    : T['value'];

// type CollectNestedProperties<
//     T extends
//         | RecordSchemaError<any>
//         | ArraySchemaError<any>
//         | { [K: string]: Either<any, any> }
//         | Either<any, any>,
// > = T extends Either<any, any>
//     ? TakeFailure<T>
//     : T extends { [K: string]: Either<any, any> }
//     ? ObjectValues<{
//           [K in keyof T]: TakeFailure<T[K]> extends RecordSchemaError<any>
//               ? CollectNestedProperties<TakeFailure<T[K]>>
//               : TakeFailure<T[K]> extends ArraySchemaError<any>
//               ? CollectNestedProperties<TakeFailure<T[K]>>
//               : TakeFailure<T[K]>;
//       }>[number]
//     : T extends ArraySchemaError<any>
//     ? RemoveNull<T['error']> | CollectNestedProperties<T['items'][number]>
//     : T extends RecordSchemaError<any>
//     ? RemoveNull<T['error']> | CollectNestedProperties<T['properties']>
//     : never;

type CollectNestedProperties<
    T extends
        | RecordSchemaError<any>
        | ArraySchemaError<any>
        | { [K: string]: Either<any, any> }
        | Either<any, any>,
> = T extends Either<any, any>
    ? TakeFailure<T>
    : T extends { [K: string]: Either<any, any> }
    ? ObjectValues<{
          [K in keyof T]: TakeFailure<T[K]> extends RecordSchemaError<any>
              ? CollectNestedProperties<TakeFailure<T[K]>>
              : TakeFailure<T[K]> extends ArraySchemaError<any>
              ? CollectNestedProperties<TakeFailure<T[K]>>
              : TakeFailure<T[K]>;
      }>[number]
    : T extends ArraySchemaError<any>
    ?
          | RemoveNull<T['error']>
          | CollectNestedProperties<
                T['items'][number] extends Either<any, RecordSchemaError<any>>
                    ? TakeFailure<T['items'][number]>
                    : T['items'][number]
            >
    : T extends RecordSchemaError<any>
    ? RemoveNull<T['error']> | CollectNestedProperties<T['properties']>
    : never;

type CollectErrors<T extends Failure<RecordSchemaError<any>>> = (
    | RemoveNull<T['value']['error']>
    | CollectNestedProperties<T['value']['properties']>
)[];

type RecordSchema<
    Definition extends {
        [Key: string]: Schema<any, any, any, any>;
    },
> = {
    uri: 'record';
    I: { [K in keyof Definition]: Definition[K]['I'] };
    O: { [K in keyof Definition]: Definition[K]['O'] };
    E: RecordSchemaError<Definition>;
    definition: Definition;
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
    ) => CollectErrors<Failure<RecordSchemaError<Definition>>>;
};

export const record = <
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
        definition,
        collectErrors: () => null as any,
    };
};
