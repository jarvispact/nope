/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, InferInputType, InferType, Schema, schema, validation } from './utils';

export const ArrayValidation = <Item extends Schema<string, any, any, any>>(item: Item) =>
    validation({
        is: (input): input is InferType<Item>[] => Array.isArray(input) && input.every(item.is),
        err: createError({ code: 'E_ARRAY' }),
    });

export const ArraySchema = <Item extends Schema<string, any, any, any>>(item: Item) =>
    schema({
        uri: 'ArraySchema',
        displayString: `ArraySchema( ${item.displayString} )`,
        create: (input: InferInputType<Item>[]) => input as InferType<Item>[],
        validation: ArrayValidation(item),
    });
