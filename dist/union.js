/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType } from './internal-utils';
import { failure, isLiteralSchema, isRecordSchema, success, } from './utils';
const unionError = (union, input) => err('union', 'E_NOT_IN_UNION', 'provided value is not in type: "union"', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'union',
        union,
    },
});
export const union = (possibleSchemas) => {
    const I = null;
    const O = null;
    const E = null;
    const serializedUnion = possibleSchemas.map((s) => {
        if (isLiteralSchema(s))
            return s.literal;
        if (isRecordSchema(s))
            return `record(${JSON.stringify(Object.fromEntries(Object.entries(s.definition).map(([k, v]) => [k, v.schema])))})`;
        return s.schema;
    });
    const validate = (input) => {
        const items = possibleSchemas.map((s) => s.validate(input));
        const isSuccessful = items.some((item) => item.status === 'SUCCESS');
        return isSuccessful
            ? success(input)
            : failure(unionError(serializedUnion, input));
    };
    return {
        schema: 'union',
        I,
        O,
        E,
        validate,
    };
};
//# sourceMappingURL=union.js.map