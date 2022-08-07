import { createError, failure, schema, SchemaError, success } from './utils';

export const boolean = schema<
    'boolean',
    boolean,
    boolean,
    SchemaError<'boolean', 'E_BOOLEAN'>
>({
    uri: 'boolean',
    is: (input) => typeof input === 'boolean',
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
