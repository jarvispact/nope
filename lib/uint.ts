import { NumberValidation } from './number';
import { createError, extendValidation, Opaque, schema } from './utils';

const tag = 'UInt';
export type UInt = Opaque<number, typeof tag>;

export const UIntValidation = extendValidation(NumberValidation)({
    is: (input): input is UInt => Number.isInteger(input) && input >= 0,
    err: createError({ code: 'E_UINT' }),
});

export const UIntSchema = schema({
    uri: 'UIntSchema',
    create: (input: number) => input as UInt,
    validation: UIntValidation,
});
