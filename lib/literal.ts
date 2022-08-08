import { createError, schema, SchemaError } from './utils';

const uri = 'literal';

export const literal = <Literal extends string | number | boolean>(
    literal: Literal,
) =>
    schema<typeof uri, Literal, Literal, SchemaError<typeof uri, 'E_LITERAL'>>({
        uri,
        displayString: `${uri}(${literal})`,
        is: (input) => input === literal,
        err: (input) =>
            createError(
                uri,
                'E_LITERAL',
                `input: "${input}" is not of type: ${uri}(${literal})`,
            ),
    });

export type LiteralSchema = typeof literal;
