import { createError, failure, schema, SchemaError, success } from './utils';

const uri = 'boolean';

export const boolean = schema<
    typeof uri,
    boolean,
    boolean,
    SchemaError<typeof uri, 'E_BOOLEAN'>
>({
    uri,
    is: (input) => typeof input === uri,
    validate: (input, { uri, is }) =>
        is(input)
            ? success(input)
            : failure(
                  createError(
                      uri,
                      'E_BOOLEAN',
                      `input: "${input}" is not of type ${uri}`,
                  ),
              ),
});

export type BooleanSchema = typeof boolean;
