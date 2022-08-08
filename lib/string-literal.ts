import { createError, schema, SchemaError } from './utils';

const uri = 'string-literal';

export const stringLiteral = <Literal extends string>(literal: Literal) =>
    schema<
        typeof uri,
        string,
        Literal,
        SchemaError<typeof uri, 'E_STRING_LITERAL'>
    >({
        uri,
        displayString: `${uri}(${literal})`,
        is: (input) => input === literal,
        err: (input) =>
            createError(
                uri,
                'E_STRING_LITERAL',
                `input: "${input}" is not of type: ${uri}(${literal})`,
            ),
    });

export type StringLiteralSchema = typeof stringLiteral;
