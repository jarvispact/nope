/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, success, failure, getErrorDetails, identity, createSchema, } from './utils';
const uri = 'union';
const err = (input, humanReadableType) => createError(uri, 'E_NOT_IN_UNION', `input is not of type: "${humanReadableType}"`, getErrorDetails(uri, input));
export const union = (wrappedSchemaList) => createSchema({
    uri,
    is: (input) => wrappedSchemaList.some((s) => s.is(input)),
    create: identity,
    validate: (input, { is, create, serialize }) => {
        if (is(input)) {
            return success(create(input));
        }
        return failure(err(input, serialize()));
    },
    serialize: () => `union([${wrappedSchemaList
        .map((s) => s.serialize())
        .join(', ')}])`,
});
//# sourceMappingURL=union.js.map