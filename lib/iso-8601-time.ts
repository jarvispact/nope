import { StringValidation } from './string';
import { createError, extendValidation, Opaque, schema } from './utils';

const tag = 'Iso8601Time';
export type Iso8601Time = Opaque<string, typeof tag>;

const timeRegex = /^\d{2}:\d{2}($|:\d{2}$|:\d{2}.\d{3}$)$/;

export const Iso8601TimeValidation = extendValidation(StringValidation)({
    is: (input): input is Iso8601Time => {
        return timeRegex.test(input) && new Date(`2000-01-01T${input}Z`).toString() !== 'Invalid Date';
    },
    err: createError({ code: 'E_ISO_8601_TIME' }),
});

export const Iso8601TimeSchema = schema({
    uri: 'Iso8601TimeSchema',
    create: (input: string) => input as Iso8601Time,
    validation: Iso8601TimeValidation,
});
