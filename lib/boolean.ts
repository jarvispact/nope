import { schema, createError, validation } from './utils';

export const BooleanValidation = validation({
    is: (input): input is boolean => typeof input === 'boolean',
    err: createError({ code: 'E_BOOLEAN' }),
});

export const BooleanSchema = schema({
    uri: 'BooleanSchema',
    create: (input: boolean) => input,
    validation: BooleanValidation,
});
