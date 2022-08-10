import { createError, schema } from './utils';
const uri = 'NumberSchema';
const errorCode = 'E_NUMBER_SCHEMA';
export const NumberSchema = schema({
    uri,
    is: (input) => typeof input === 'number',
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=number.js.map