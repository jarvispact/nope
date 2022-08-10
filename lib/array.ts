/* eslint-disable @typescript-eslint/no-explicit-any */

import { createError, Either, Schema, schema, SchemaError } from './utils';

const uri = 'ArraySchema';
const errorCode = 'E_ARRAY_SCHEMA';

export type ArraySchemaError<ItemSchema extends Schema<any, any, any, any>> = {
    error: SchemaError<typeof uri, typeof errorCode, ItemSchema['I'][]> | null;
    items: Either<ItemSchema['O'], ItemSchema['E']>[];
};

export type ArraySchema<ItemSchema extends Schema<any, any, any, any>> = Schema<
    typeof uri,
    ItemSchema['I'][],
    ItemSchema['O'][],
    ArraySchemaError<ItemSchema>
>;

export const ArraySchema = <ItemSchema extends Schema<any, any, any, any>>(
    itemSchema: ItemSchema,
): ArraySchema<ItemSchema> =>
    schema<
        typeof uri,
        ItemSchema['I'][],
        ItemSchema['O'][],
        ArraySchemaError<ItemSchema>
    >({
        uri,
        displayString: `array(${itemSchema.displayString})`,
        is: (arrayInput) =>
            Array.isArray(arrayInput) ? arrayInput.every(itemSchema.is) : false,
        err: (arrayInput, { displayString }) =>
            Array.isArray(arrayInput)
                ? {
                      error: null,
                      items: arrayInput.map(itemSchema.validate),
                  }
                : {
                      error: createError(
                          uri,
                          errorCode,
                          `input: "${arrayInput}" is not of type: ${displayString}`,
                          arrayInput,
                      ),
                      items: [],
                  },
    });
