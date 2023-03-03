/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, InferInputType, InferType, Schema, schema, validation } from './utils';

const unionListToDisplayString = <List extends Schema<string, any, any, any>[]>(list: List) =>
    `UnionSchema( ${list.map((s) => s.displayString).join(' | ')} )`;

export const UnionValidation = <List extends Schema<string, any, any, any>[]>(list: List) =>
    validation({
        is: (input): input is InferType<List[number]> => list.some((s) => s.is(input)),
        err: createError({ code: 'E_UNION' }),
    });

export const UnionSchema = <List extends Schema<string, any, any, any>[]>(list: List) => {
    if (list.length <= 1) throw new Error('a UnionSchemas list argument must have a length of at least 2');
    return schema({
        uri: 'UnionSchema',
        displayString: unionListToDisplayString(list),
        create: (input: InferInputType<List[number]>) => input as InferType<List[number]>,
        validation: UnionValidation(list),
    });
};
