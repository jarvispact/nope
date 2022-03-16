/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, success, failure, getErrorDetails, identity, createSchema, } from './utils';
const uri = 'union';
const err = (input, wrappedSchemaList) => {
    const humanReadableType = `union([${wrappedSchemaList
        .map((s) => s.serialize())
        .join(', ')}])`;
    return createError(uri, 'E_NO_UNION', `input is not of type: "${humanReadableType}"`, getErrorDetails(uri, input));
};
export const union = (wrappedSchemaList) => createSchema({
    uri: uri,
    is: (input) => wrappedSchemaList.some((s) => s.is(input)),
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) {
            return success(create(input));
        }
        return failure(err(input, wrappedSchemaList));
    },
});
//# sourceMappingURL=union.js.map