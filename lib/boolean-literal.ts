import { createError, schema, SchemaError } from './utils';

const uri = 'boolean-literal';

export const booleanLiteral = <Literal extends boolean>(literal: Literal) =>
    schema<
        typeof uri,
        boolean,
        Literal,
        SchemaError<typeof uri, 'E_BOOLEAN_LITERAL'>
    >({
        uri,
        displayString: `${uri}(${literal})`,
        is: (input) => input === literal,
        err: (input) =>
            createError(
                uri,
                'E_BOOLEAN_LITERAL',
                `input: "${input}" is not of type: ${uri}(${literal})`,
            ),
    });

export type BooleanLiteralSchema = typeof booleanLiteral;
