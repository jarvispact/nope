import { createError, schema, SchemaError } from './utils';

const uri = 'number-literal';

export const numberLiteral = <Literal extends number>(literal: Literal) =>
    schema<
        typeof uri,
        number,
        Literal,
        SchemaError<typeof uri, 'E_NUMBER_LITERAL'>
    >({
        uri,
        displayString: `${uri}(${literal})`,
        is: (input) => input === literal,
        err: (input) =>
            createError(
                uri,
                'E_NUMBER_LITERAL',
                `input: "${input}" is not of type: ${uri}(${literal})`,
            ),
    });

export type NumberLiteralSchema = typeof numberLiteral;
