/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, failure, schema, success, } from './utils';
export const union = (schemaList) => schema({
    uri: 'union',
    is: (input) => schemaList.some((s) => s.is(input)),
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_UNION', `input: "${input}" is not of type ${uri}(${schemaList
            .map((s) => s.uri)
            .join(', ')})`)),
});
//# sourceMappingURL=union.js.map