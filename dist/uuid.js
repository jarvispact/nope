import { StringSchema } from './string';
import { createError, schema } from './utils';
const uri = 'UuidSchema';
const errorCode = 'E_UUID_SCHEMA';
export const UuidSchema = schema({
    uri,
    is: (input) => StringSchema.is(input) &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input),
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=uuid.js.map