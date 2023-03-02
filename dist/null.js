import { schema, createError, validation } from './utils';
export const NullValidation = validation({
    is: (input) => input === null,
    err: createError({ code: 'E_NULL' }),
});
export const NullSchema = schema({
    uri: 'NullSchema',
    create: (input) => input,
    validation: NullValidation,
});
//# sourceMappingURL=null.js.map