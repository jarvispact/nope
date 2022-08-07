import { createError, failure, schema, success } from './utils';
export const boolean = schema({
    uri: 'boolean',
    is: (input) => typeof input === 'boolean',
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_BOOLEAN', `input: "${input}" is not of type ${uri}`)),
});
//# sourceMappingURL=boolean.js.map