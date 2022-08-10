import { createError, schema, SchemaError } from './utils';

const uri = 'LiteralSchema';
const errorCode = 'E_LITERAL_SCHEMA';

export const LiteralSchema = <Literal extends string | number | boolean>(
    literal: Literal,
) =>
    schema<
        typeof uri,
        Literal,
        Literal,
        SchemaError<typeof uri, typeof errorCode, Literal>
    >({
        uri,
        displayString: `${uri}(${literal})`,
        is: (input) => input === literal,
        err: (input) =>
            createError(
                uri,
                errorCode,
                `input: "${input}" is not of type: ${uri}(${literal})`,
                input,
            ),
    });

export type LiteralSchema = typeof LiteralSchema;
