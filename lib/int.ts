import { NumberValidation } from './number';
import { createError, extendValidation, Opaque, schema } from './utils';

const tag = 'Int';
export type Int = Opaque<number, typeof tag>;

export const IntValidation = extendValidation(NumberValidation)({
    is: (input): input is Int => Number.isInteger(input),
    err: createError({ code: 'E_INT' }),
});

export const IntSchema = schema({
    uri: 'IntSchema',
    create: (input: number) => input as Int,
    validation: IntValidation,
});
