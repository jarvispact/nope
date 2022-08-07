/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    createError,
    Either,
    failure,
    Schema,
    schema,
    SchemaError,
    success,
} from './utils';

const uri = 'array';

export type ArraySchemaError<ItemSchema extends Schema<any, any, any, any>> = {
    error: SchemaError<typeof uri, 'E_ARRAY'> | null;
    items: Either<ItemSchema['O'], ItemSchema['E']>[];
};

export type ArraySchema<ItemSchema extends Schema<any, any, any, any>> = {
    uri: typeof uri;
    I: ItemSchema['I'][];
    O: ItemSchema['O'][];
    E: ArraySchemaError<ItemSchema>;
    is: (input: ItemSchema['I'][]) => input is ItemSchema['O'][];
    validate: (
        input: ItemSchema['I'][],
    ) => Either<ItemSchema['O'][], ArraySchemaError<ItemSchema>>;
};

export const array = <ItemSchema extends Schema<any, any, any, any>>(
    itemSchema: ItemSchema,
): ArraySchema<ItemSchema> => {
    const _schema = schema<
        typeof uri,
        ItemSchema['I'][],
        ItemSchema['O'][],
        ArraySchemaError<ItemSchema>
    >({
        uri,
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
