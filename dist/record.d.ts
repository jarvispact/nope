import { ArraySchemaError } from './array';
import { Either, Failure, Schema, SchemaError, Success } from './utils';
declare type RecordSchemaError<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}> = {
    error: SchemaError<'record', 'E_RECORD'> | null;
    properties: {
        [K in keyof Definition]: Either<Definition[K]['O'], Definition[K]['E']>;
    };
};
declare type RemoveNull<T> = T extends null ? never : T;
declare type ObjectValues<T extends {
    [K: string]: any;
}> = T[keyof T][];
declare type TakeFailure<T extends Either<any, any>> = T extends Success<T['value']> ? never : T['value'];
declare type CollectNestedProperties<T extends RecordSchemaError<any> | ArraySchemaError<any> | {
    [K: string]: Either<any, any>;
} | Either<any, any>> = T extends Either<any, any> ? TakeFailure<T> : T extends {
    [K: string]: Either<any, any>;
} ? ObjectValues<{
    [K in keyof T]: TakeFailure<T[K]> extends RecordSchemaError<any> ? CollectNestedProperties<TakeFailure<T[K]>> : TakeFailure<T[K]> extends ArraySchemaError<any> ? CollectNestedProperties<TakeFailure<T[K]>> : TakeFailure<T[K]>;
}>[number] : T extends ArraySchemaError<any> ? RemoveNull<T['error']> | CollectNestedProperties<T['items'][number] extends Either<any, RecordSchemaError<any>> ? TakeFailure<T['items'][number]> : T['items'][number]> : T extends RecordSchemaError<any> ? RemoveNull<T['error']> | CollectNestedProperties<T['properties']> : never;
declare type CollectErrors<T extends Failure<RecordSchemaError<any>>> = (RemoveNull<T['value']['error']> | CollectNestedProperties<T['value']['properties']>)[];
declare type RecordSchema<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}> = {
    uri: 'record';
    I: {
        [K in keyof Definition]: Definition[K]['I'];
    };
    O: {
        [K in keyof Definition]: Definition[K]['O'];
    };
    E: RecordSchemaError<Definition>;
    definition: Definition;
    is: (input: {
        [K in keyof Definition]: Definition[K]['I'];
    }) => input is {
        [K in keyof Definition]: Definition[K]['O'];
    };
    validate: (input: {
        [K in keyof Definition]: Definition[K]['I'];
    }) => Either<{
        [K in keyof Definition]: Definition[K]['O'];
    }, RecordSchemaError<Definition>>;
    collectErrors: (failure: Failure<RecordSchemaError<Definition>>) => CollectErrors<Failure<RecordSchemaError<Definition>>>;
};
export declare const record: <Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}>(definition: Definition) => RecordSchema<Definition>;
export {};
