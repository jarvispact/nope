import { createError, failure, schema, SchemaError, success } from './utils';

const uri = 'boolean-literal';

export const booleanLiteral = <Literal extends boolean>(literal: Literal) =>
    schema<
        typeof uri,
        boolean,
        Literal,
        SchemaError<typeof uri, 'E_BOOLEAN_LITERAL'>
    >({
        uri,
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
