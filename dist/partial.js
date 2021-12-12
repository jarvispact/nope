/* eslint-disable @typescript-eslint/no-explicit-any */
import { notARecordError, record, } from './record';
import { failure, isObject, objectKeys, } from './utils';
export const partial = (recordSchemaDefinition) => {
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => {
        if (!isObject(input)) {
            return failure({
                errors: [
                    notARecordError(recordSchemaDefinition.definition, input),
                ],
                properties: {},
            });
        }
        const partialDefinition = Object.fromEntries(Object.entries(recordSchemaDefinition.definition).filter(([k]) => objectKeys(input).includes(k)));
        // TODO: E_MISSING_KEYS is not a valid error in case of a partial record
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return record(partialDefinition).validate(input);
    };
    return {
        schema: 'partial',
        I,
        O,
        E,
        validate,
    };
};
//# sourceMappingURL=partial.js.map