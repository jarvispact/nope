import { Either, Schema, SchemaError } from './utils';
export declare type ArraySchemaError<ItemSchema extends Schema<any, any, any, any>> = {
    error: SchemaError<'array', 'E_ARRAY'> | null;
    items: Either<ItemSchema['O'], ItemSchema['E']>[];
};
export declare type ArraySchema<ItemSchema extends Schema<any, any, any, any>> = {
    uri: 'array';
    I: ItemSchema['I'][];
    O: ItemSchema['O'][];
    E: ArraySchemaError<ItemSchema>;
    is: (input: ItemSchema['I'][]) => input is ItemSchema['O'][];
    validate: (input: ItemSchema['I'][]) => Either<ItemSchema['O'][], ArraySchemaError<ItemSchema>>;
};
export declare const array: <ItemSchema extends Schema<any, any, any, any>>(itemSchema: ItemSchema) => ArraySchema<ItemSchema>;
