import { createError, schema } from './utils';
const uri = 'date';
export const date = schema({
    uri,
    is: (input) => input instanceof Date && input.toString() !== 'Invalid Date',
    err: (input) => createError(uri, 'E_DATE', `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=date.js.map