import { createError, failure, schema, SchemaError, success } from './utils';

const uri = 'number';

export const number = schema<
    typeof uri,
    number,
    number,
    SchemaError<typeof uri, 'E_NUMBER'>
>({
    uri,
    is: (input) => typeof input === typeof uri,
    validate: (input, { uri, is }) =>
        is(input)
            ? success(input)
            : failure(
                  createError(
                      uri,
                      'E_NUMBER',
                      `input: "${input}" is not of type ${uri}`,
                  ),
              ),
});

export type NumberSchema = typeof number;
