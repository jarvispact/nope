import { success } from './utils';
export const optional = (wrappedSchema) => {
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => input === undefined
        ? success(undefined)
        : wrappedSchema.validate(input);
    return {
        schema: 'optional',
        I,
        O,
        E,
        validate,
    };
};
//# sourceMappingURL=optional.js.map