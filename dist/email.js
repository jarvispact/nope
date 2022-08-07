import { string } from './string';
import { createError, failure, schema, success, } from './utils';
export const email = schema({
    uri: 'email',
    is: (input) => string.is(input) && input.includes('@'),
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_EMAIL', `input: "${input}" is not of type ${uri}`)),
});
//# sourceMappingURL=email.js.map