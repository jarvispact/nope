import { Either, Schema, SchemaError } from './utils';
declare const uri = "array";
export declare type ArraySchemaError<ItemSchema extends Schema<any, any, any, any>> = {
    error: SchemaError<typeof uri, 'E_ARRAY', ItemSchema['I'][]> | null;
    items: Either<ItemSchema['O'], ItemSchema['E']>[];
};
export declare type ArraySchema<ItemSchema extends Schema<any, any, any, any>> = Schema<typeof uri, ItemSchema['I'][], ItemSchema['O'][], ArraySchemaError<ItemSchema>>;
export declare const array: <ItemSchema extends Schema<any, any, any, any>>(itemSchema: ItemSchema) => ArraySchema<ItemSchema>;
export {};
