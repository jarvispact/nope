import { createError, failure, schema, success } from './utils';
export const string = schema({
    uri: 'string',
    is: (input) => typeof input === 'string',
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_STRING', `input: "${input}" is not of type ${uri}`)),
});
//# sourceMappingURL=string.js.map