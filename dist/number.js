import { createError, failure, schema, success } from './utils';
export const number = schema({
    uri: 'number',
    is: (input) => typeof input === 'number',
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_NUMBER', `input: "${input}" is not of type ${uri}`)),
});
//# sourceMappingURL=number.js.map