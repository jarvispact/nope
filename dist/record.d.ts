import { ArraySchemaError } from './array';
import { Either, Invalid, Schema, SchemaError, Valid } from './utils';
declare const uri = "record";
declare type RecordSchemaError<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}> = {
    error: SchemaError<typeof uri, 'E_RECORD', {
        [K in keyof Definition]: Definition[K]['I'];
    }> | null;
    properties: {
        [K in keyof Definition]: Either<Definition[K]['O'], Definition[K]['E']>;
    };
};
declare type RemoveNull<T> = T extends null ? never : T;
declare type ObjectValues<T extends {
    [K: string]: any;
}> = T[keyof T][];
declare type TakeFailure<T extends Either<any, any>> = T extends Valid<T['value']> ? never : T['value'];
declare type CollectNestedProperties<T extends RecordSchemaError<any> | ArraySchemaError<any> | {
    [K: string]: Either<any, any>;
} | Either<any, any>> = T extends Either<any, any> ? TakeFailure<T> : T extends {
    [K: string]: Either<any, any>;
} ? ObjectValues<{
    [K in keyof T]: TakeFailure<T[K]> extends RecordSchemaError<any> ? CollectNestedProperties<TakeFailure<T[K]>> : TakeFailure<T[K]> extends ArraySchemaError<any> ? CollectNestedProperties<TakeFailure<T[K]>> : TakeFailure<T[K]>;
}>[number] : T extends ArraySchemaError<any> ? RemoveNull<T['error']> | CollectNestedProperties<T['items'][number] extends Either<any, RecordSchemaError<any>> ? TakeFailure<T['items'][number]> : T['items'][number]> : T extends RecordSchemaError<any> ? RemoveNull<T['error']> | CollectNestedProperties<T['properties']> : never;
declare type CollectErrors<T extends Invalid<RecordSchemaError<any>>> = ((RemoveNull<T['value']['error']> | CollectNestedProperties<T['value']['properties']>) & {
    path: string;
})[];
declare type RecordSchema<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}> = Schema<typeof uri, {
    [K in keyof Definition]: Definition[K]['I'];
}, {
    [K in keyof Definition]: Definition[K]['O'];
}, RecordSchemaError<Definition>> & {
    definition: Definition;
    collectErrors: (failure: Invalid<RecordSchemaError<Definition>>) => CollectErrors<Invalid<RecordSchemaError<Definition>>>;
};
export declare const record: <Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}>(definition: Definition) => RecordSchema<Definition>;
export {};
