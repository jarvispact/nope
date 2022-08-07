import { createError, failure, schema, SchemaError, success } from './utils';

export const numberLiteral = <Literal extends number>(literal: Literal) =>
    schema<
        'number-literal',
        number,
        Literal,
        SchemaError<'number-literal', 'E_NUMBER_LITERAL'>
    >({
        uri: 'number-literal',
        is: (input) => input === literal,
        validate: (input, { uri, is }) =>
            is(input)
                ? success(input)
                : failure(
                      createError(
                          uri,
                          'E_NUMBER_LITERAL',
                          `input: "${input}" is not of type ${uri}(${literal})`,
                      ),
                  ),
    });

export type NumberLiteralSchema = typeof numberLiteral;
