import { Iso8601DateValidation } from './iso-8601-date';
import { Iso8601TimeValidation } from './iso-8601-time';
import { StringValidation } from './string';
import { createError, extendValidation, Opaque, schema } from './utils';

const tag = 'Iso8601DateTime';
export type Iso8601DateTime = Opaque<string, typeof tag>;

export const Iso8601DateTimeValidation = extendValidation(StringValidation)({
    is: (input): input is Iso8601DateTime => {
        const [date, time] = input.split('T');
        if (!date || !time) return false;

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
    create: (input: string) => input as Iso8601DateTime,
    validation: Iso8601DateTimeValidation,
});
