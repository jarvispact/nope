import { createError, inputToDisplayString, schema, SchemaError, validation } from './utils';

type Primitive = string | number | boolean | symbol;

type PrimitiveOf<T extends Primitive> = T extends string
    ? string
    : T extends number
    ? number
    : T extends boolean
    ? boolean
    : T extends symbol
    ? symbol
    : unknown;

type LooseAutoComplete<T extends Primitive> = T extends boolean
    ? boolean
    : T | Omit<PrimitiveOf<T>, Exclude<T, boolean>>;

export const LiteralValidation = <Literal extends Primitive>(literal: Literal) =>
    validation({
        is: (input: Literal): input is Literal => input === literal,
        err: createError({ code: 'E_LITERAL', details: { literal } }),
    });

export const LiteralSchema = <Literal extends Primitive>(literal: Literal) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    schema<'LiteralSchema', LooseAutoComplete<Literal>, Literal, 'E_LITERAL', SchemaError<'E_LITERAL'>>({
        uri: 'LiteralSchema',
        displayString: `LiteralSchema(${inputToDisplayString(literal)})`,
        create: (input: LooseAutoComplete<Literal>) => input as Literal,
        validation: LiteralValidation(literal),
    });
