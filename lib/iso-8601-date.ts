import { StringValidation } from './string';
import { createError, extendValidation, Opaque, schema } from './utils';

const tag = 'Iso8601Date';
export type Iso8601Date = Opaque<string, typeof tag>;

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const Iso8601DateValidation = extendValidation(StringValidation)({
    is: (input): input is Iso8601Date => dateRegex.test(input) && new Date(input).toString() !== 'Invalid Date',
    err: createError({ code: 'E_ISO_8601_DATE' }),
});

export const Iso8601DateSchema = schema({
    uri: 'Iso8601DateSchema',
    create: (input: string) => input as Iso8601Date,
    validation: Iso8601DateValidation,
});
