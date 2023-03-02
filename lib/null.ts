import { schema, createError, validation } from './utils';

export const NullValidation = validation({
    is: (input): input is null => input === null,
    err: createError({ code: 'E_NULL' }),
});

export const NullSchema = schema({
    uri: 'NullSchema',
    create: (input: null) => input,
    validation: NullValidation,
});
