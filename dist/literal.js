import { createError, inputToDisplayString, schema, validation } from './utils';
export const LiteralValidation = (literal) => validation({
    is: (input) => input === literal,
    err: createError({ code: 'E_LITERAL', details: { literal } }),
});
export const LiteralSchema = (literal) => 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
schema({
    uri: 'LiteralSchema',
    displayString: `LiteralSchema(${inputToDisplayString(literal)})`,
    create: (input) => input,
    validation: LiteralValidation(literal),
});
//# sourceMappingURL=literal.js.map