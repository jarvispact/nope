import { schema, createError, validation } from './utils';
export const BooleanValidation = validation({
    is: (input) => typeof input === 'boolean',
    err: createError({ code: 'E_BOOLEAN' }),
});
export const BooleanSchema = schema({
    uri: 'BooleanSchema',
    create: (input) => input,
    validation: BooleanValidation,
});
//# sourceMappingURL=boolean.js.map