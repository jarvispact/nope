import { StringValidation } from './string';
import { createError, extendValidation, schema } from './utils';
const tag = 'Iso8601Time';
const timeRegex = /^\d{2}:\d{2}($|:\d{2}$|:\d{2}.\d{3}$)$/;
export const Iso8601TimeValidation = extendValidation(StringValidation)({
    is: (input) => {
        return timeRegex.test(input) && new Date(`2000-01-01T${input}Z`).toString() !== 'Invalid Date';
    },
    err: createError({ code: 'E_ISO_8601_TIME' }),
});
export const Iso8601TimeSchema = schema({
    uri: 'Iso8601TimeSchema',
    create: (input) => input,
    validation: Iso8601TimeValidation,
});
//# sourceMappingURL=iso-8601-time.js.map