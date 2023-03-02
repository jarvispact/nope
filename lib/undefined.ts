import { schema, createError, validation } from './utils';

export const UndefinedValidation = validation({
    is: (input): input is undefined => input === undefined,
    err: createError({ code: 'E_UNDEFINED' }),
});

export const UndefinedSchema = schema({
    uri: 'UndefinedSchema',
    create: (input: undefined) => input,
    validation: UndefinedValidation,
});
