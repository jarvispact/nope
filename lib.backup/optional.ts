import { Either, Schema, success } from './utils.backup.ts.backup';

export const optional = <I, O extends I, E>(
    wrappedSchema: Schema<I, O, E>,
): Schema<I | undefined, O | undefined, E> => {
    const I = null as unknown as I | undefined;
    const O = null as unknown as O | undefined;
    const E = null as unknown as E;

    const validate = (input: typeof I): Either<typeof O, typeof E> =>
        input === undefined
            ? success(undefined)
            : wrappedSchema.validate(input);

    return {
        schema: 'optional',
        I,
        O,
        E,
        validate,
    };
};
