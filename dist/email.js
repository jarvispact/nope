import { StringValidation } from './string';
import { createError, extendValidation, schema } from './utils';
const tag = 'Email';
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const EmailValidation = extendValidation(StringValidation)({
    is: (input) => emailRegex.test(input),
    err: createError({ code: 'E_EMAIL' }),
});
export const EmailSchema = schema({
    uri: 'EmailSchema',
    create: (input) => input,
    validation: EmailValidation,
});
//# sourceMappingURL=email.js.map