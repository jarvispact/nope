/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, schema } from './utils';
const uri = 'union';
export const union = (schemaList) => schema({
    uri,
    displayString: `${schemaList.map((s) => s.displayString).join(' | ')}`,
    is: (input) => schemaList.some((s) => s.is(input)),
    err: (input, { displayString }) => createError(uri, 'E_UNION', `input: "${input}" is not of type: ${displayString}`),
});
//# sourceMappingURL=union.js.map