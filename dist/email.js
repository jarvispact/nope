import { StringSchema } from './string';
import { createError, schema } from './utils';
const uri = 'EmailSchema';
const errorCode = 'E_EMAIL_SCHEMA';
export const EmailSchema = schema({
    uri,
    is: (input) => StringSchema.is(input) &&
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=email.js.map