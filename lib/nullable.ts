import { Either, Schema, success } from './utils';

export const nullable = <I, O extends I, E>(
    wrappedSchema: Schema<I, O, E>,
): Schema<I | null, O | null, E> => {
    const I = null as unknown as I | null;
    const O = null as unknown as O | null;
    const E = null as unknown as E;

    const validate = (input: typeof I): Either<typeof O, typeof E> =>
        input === null ? success(null) : wrappedSchema.validate(input);

    return {
        schema: 'nullable',
        I,
        O,
        E,
        validate,
    };
};
