import { Iso8601DateValidation } from './iso-8601-date';
import { Iso8601TimeValidation } from './iso-8601-time';
import { StringValidation } from './string';
import { createError, extendValidation, schema } from './utils';
const tag = 'Iso8601DateTime';
export const Iso8601DateTimeValidation = extendValidation(StringValidation)({
    is: (input) => {
        const [date, time] = input.split('T');
        if (!date || !time)
            return false;
        if (time.endsWith('Z')) {
            const [timeWithoutZ] = time.split('Z');
            return Iso8601DateValidation.is(date) && Iso8601TimeValidation.is(timeWithoutZ);
        }
        return Iso8601DateValidation.is(date) && Iso8601TimeValidation.is(time);
    },
    err: createError({ code: 'E_ISO_8601_DATE_TIME' }),
});
export const Iso8601DateTimeSchema = schema({
    uri: 'Iso8601DateTimeSchema',
    create: (input) => input,
    validation: Iso8601DateTimeValidation,
});
//# sourceMappingURL=iso-8601-date-time.js.map