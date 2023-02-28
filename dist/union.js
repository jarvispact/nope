/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, schema, validation } from './utils';
const unionListToDisplayString = (list) => `UnionSchema( ${list.map((s) => s.displayString).join(' | ')} )`;
export const UnionValidation = (list) => validation({
    is: (input) => list.some((s) => s.is(input)),
    err: createError({ code: 'E_UNION' }),
});
export const UnionSchema = (list) => {
    if (list.length <= 1)
        throw new Error('a UnionSchemas list argument must have a length of at least 2');
    return schema({
        uri: 'UnionSchema',
        displayString: unionListToDisplayString(list),
        create: (input) => input,
        validation: UnionValidation(list),
    });
};
//# sourceMappingURL=union.js.map