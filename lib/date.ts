import { createError, schema, validation } from './utils';

export const DateValidation = validation({
    is: (input): input is Date => input instanceof Date && input.toString() !== 'Invalid Date',
    err: createError({ code: 'E_DATE' }),
});

export const DateSchema = schema({
    uri: 'DateSchema',
    create: (input: Date) => input,
    validation: DateValidation,
});
