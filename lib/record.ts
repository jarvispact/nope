/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArraySchemaError } from './array';
import {
    createError,
    Either,
    Invalid,
    isRecord,
    objectKeys,
    Schema,
    schema,
    SchemaError,
    Valid,
} from './utils';

const uri = 'record';

type RecordSchemaError<
    Definition extends {
        [Key: string]: Schema<any, any, any, any>;
    },
> = {
    error: SchemaError<typeof uri, 'E_RECORD'> | null;
    properties: {
        [K in keyof Definition]: Either<Definition[K]['O'], Definition[K]['E']>;
    };
};

type RemoveNull<T> = T extends null ? never : T;

type ObjectValues<T extends { [K: string]: any }> = T[keyof T][];

type TakeFailure<T extends Either<any, any>> = T extends Valid<T['value']>
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

type CollectErrors<T extends Invalid<RecordSchemaError<any>>> = (
    | RemoveNull<T['value']['error']>
    | CollectNestedProperties<T['value']['properties']>
)[];

type RecordSchema<
    Definition extends {
        [Key: string]: Schema<any, any, any, any>;
    },
> = {
    uri: typeof uri;
    displayString: string;
    I: { [K in keyof Definition]: Definition[K]['I'] };
    O: { [K in keyof Definition]: Definition[K]['O'] };
    E: RecordSchemaError<Definition>;
    definition: Definition;
    is: (input: { [K in keyof Definition]: Definition[K]['I'] }) => input is {
        [K in keyof Definition]: Definition[K]['O'];
    };
    err: (input: {
        [K in keyof Definition]: Definition[K]['I'];
    }) => RecordSchemaError<Definition>;
    validate: (input: {
        [K in keyof Definition]: Definition[K]['I'];
    }) => Either<
        { [K in keyof Definition]: Definition[K]['O'] },
        RecordSchemaError<Definition>
    >;
    collectErrors: (
        failure: Invalid<RecordSchemaError<Definition>>,
    ) => CollectErrors<Invalid<RecordSchemaError<Definition>>>;
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
        typeof uri,
        { [K in keyof Definition]: Definition[K]['I'] },
        { [K in keyof Definition]: Definition[K]['O'] },
        RecordSchemaError<Definition>
    >({
        uri,
        displayString: `record({${objectKeys(definition)
            .map((key) => `${key.toString()}: ${definition[key].displayString}`)
            .join(', ')}})`,
        is: (input) =>
            isRecord(input) &&
            objectKeys(definition).every((defKey) =>
                definition[defKey].is(input[defKey]),
            ),
        err: (input, { displayString }) =>
            isRecord(input)
                ? {
                      error: null,
                      properties: objectKeys(definition).reduce(
                          (accum, defKey) => {
                              accum[defKey] = definition[defKey].validate(
                                  input[defKey],
                              );
                              return accum;
                          },
                          {} as Properties,
                      ),
                  }
                : {
                      error: createError(
                          uri,
                          'E_RECORD',
                          `input: "${input}" is not of type: ${displayString}`,
                      ),
                      properties: {} as Properties,
                  },
    });

    return {
        ..._schema,
        definition,
        collectErrors: () => null as any,
    };
};
