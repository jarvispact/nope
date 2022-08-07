import { createError, failure, schema, SchemaError, success } from './utils';

const uri = 'string-literal';

export const stringLiteral = <Literal extends string>(literal: Literal) =>
    schema<
        typeof uri,
        string,
        Literal,
        SchemaError<typeof uri, 'E_STRING_LITERAL'>
    >({
        uri,
        is: (input) => input === literal,
        validate: (input, { uri, is }) =>
            is(input)
                ? success(input)
                : failure(
                      createError(
                          uri,
                          'E_STRING_LITERAL',
                          `input: "${input}" is not of type ${uri}(${literal})`,
                      ),
                  ),
    });

export type StringLiteralSchema = typeof stringLiteral;
