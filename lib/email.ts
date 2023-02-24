import { StringValidation } from './string';
import { createError, extendValidation, Opaque, schema } from './utils';

const tag = 'Email';
export type Email = Opaque<string, typeof tag>;

const emailRegex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const EmailValidation = extendValidation(StringValidation)({
    is: (input): input is Email => emailRegex.test(input),
    err: createError({ code: 'E_EMAIL' }),
});

export const EmailSchema = schema({
    uri: 'EmailSchema',
    create: (input: string) => input as Email,
    validation: EmailValidation,
});
