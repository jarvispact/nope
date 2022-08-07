import { createError, failure, schema, SchemaError, success } from './utils';

const uri = 'number-literal';

export const numberLiteral = <Literal extends number>(literal: Literal) =>
    schema<
        typeof uri,
        number,
        Literal,
        SchemaError<typeof uri, 'E_NUMBER_LITERAL'>
    >({
        uri,
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
