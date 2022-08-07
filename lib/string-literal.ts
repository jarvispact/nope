import { createError, failure, schema, SchemaError, success } from './utils';

export const stringLiteral = <Literal extends string>(literal: Literal) =>
    schema<
        'string-literal',
        string,
        Literal,
        SchemaError<'string-literal', 'E_STRING_LITERAL'>
    >({
        uri: 'string-literal',
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
