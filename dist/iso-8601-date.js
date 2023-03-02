import { StringValidation } from './string';
import { createError, extendValidation, schema } from './utils';
const tag = 'Iso8601Date';
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
export const Iso8601DateValidation = extendValidation(StringValidation)({
    is: (input) => dateRegex.test(input) && new Date(input).toString() !== 'Invalid Date',
    err: createError({ code: 'E_ISO_8601_DATE' }),
});
export const Iso8601DateSchema = schema({
    uri: 'Iso8601DateSchema',
    create: (input) => input,
    validation: Iso8601DateValidation,
});
//# sourceMappingURL=iso-8601-date.js.map