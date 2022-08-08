import { Either, Schema, SchemaError } from './utils';
declare const uri = "array";
export declare type ArraySchemaError<ItemSchema extends Schema<any, any, any, any>> = {
    error: SchemaError<typeof uri, 'E_ARRAY'> | null;
    items: Either<ItemSchema['O'], ItemSchema['E']>[];
};
export declare type ArraySchema<ItemSchema extends Schema<any, any, any, any>> = {
    uri: typeof uri;
    displayString: string;
    I: ItemSchema['I'][];
    O: ItemSchema['O'][];
    E: ArraySchemaError<ItemSchema>;
    is: (input: ItemSchema['I'][]) => input is ItemSchema['O'][];
    err: (input: ItemSchema['I'][]) => ArraySchemaError<ItemSchema>;
    validate: (input: ItemSchema['I'][]) => Either<ItemSchema['O'][], ArraySchemaError<ItemSchema>>;
};
export declare const array: <ItemSchema extends Schema<any, any, any, any>>(itemSchema: ItemSchema) => ArraySchema<ItemSchema>;
export {};
