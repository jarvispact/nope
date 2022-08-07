import { createError, failure, schema, SchemaError, success } from './utils';

export const booleanLiteral = <Literal extends boolean>(literal: Literal) =>
    schema<
        'boolean-literal',
        boolean,
        Literal,
        SchemaError<'boolean-literal', 'E_BOOLEAN_LITERAL'>
    >({
        uri: 'boolean-literal',
        is: (input) => input === literal,
        validate: (input, { uri, is }) =>
            is(input)
                ? success(input)
                : failure(
                      createError(
                          uri,
                          'E_BOOLEAN_LITERAL',
                          `input: "${input}" is not of type ${uri}(${literal})`,
                      ),
                  ),
    });

export type BooleanLiteralSchema = typeof booleanLiteral;
