import { createError, schema, SchemaError } from './utils';

const uri = 'boolean';

export const boolean = schema<
    typeof uri,
    boolean,
    boolean,
    SchemaError<typeof uri, 'E_BOOLEAN', boolean>
>({
    uri,
    is: (input) => typeof input === uri,
    err: (input) =>
        createError(
            uri,
            'E_BOOLEAN',
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type BooleanSchema = typeof boolean;
