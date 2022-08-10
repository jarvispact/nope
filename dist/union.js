/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, schema } from './utils';
const uri = 'UnionSchema';
const errorCode = 'E_UNION_SCHEMA';
export const UnionSchema = (schemaList) => schema({
    uri,
    displayString: `${schemaList.map((s) => s.displayString).join(' | ')}`,
    is: (input) => schemaList.some((s) => s.is(input)),
    err: (input, { displayString }) => createError(uri, errorCode, `input: "${input}" is not of type: ${displayString}`, input),
});
//# sourceMappingURL=union.js.map