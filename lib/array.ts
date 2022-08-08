/* eslint-disable @typescript-eslint/no-explicit-any */

import { createError, Either, Schema, schema, SchemaError } from './utils';

const uri = 'array';

export type ArraySchemaError<ItemSchema extends Schema<any, any, any, any>> = {
    error: SchemaError<typeof uri, 'E_ARRAY', ItemSchema['I'][]> | null;
    items: Either<ItemSchema['O'], ItemSchema['E']>[];
};

export type ArraySchema<ItemSchema extends Schema<any, any, any, any>> = {
    uri: typeof uri;
    displayString: string;
    I: ItemSchema['I'][];
    O: ItemSchema['O'][];
    E: ArraySchemaError<ItemSchema>;
    is: (input: ItemSchema['I'][]) => input is ItemSchema['O'][];
    err: (input: ItemSchema['I'][]) => ArraySchemaError<ItemSchema>;
    validate: (
        input: ItemSchema['I'][],
    ) => Either<ItemSchema['O'][], ArraySchemaError<ItemSchema>>;
};

export const array = <ItemSchema extends Schema<any, any, any, any>>(
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
                          'E_ARRAY',
                          `input: "${arrayInput}" is not of type: ${displayString}`,
                          arrayInput,
                      ),
                      items: [],
                  },
    });
