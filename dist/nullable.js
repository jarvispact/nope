import { success } from './utils';
export const nullable = (wrappedSchema) => {
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => input === null ? success(null) : wrappedSchema.validate(input);
    return {
        schema: 'nullable',
        I,
        O,
        E,
        validate,
    };
};
//# sourceMappingURL=nullable.js.map