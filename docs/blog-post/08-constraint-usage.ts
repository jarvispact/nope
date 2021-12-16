import { err, getDisplayType } from '../../lib/internal-utils';

const stringConstraint = <I extends string, C extends string, T>({
    when,
    error,
}: {
    when: (input: I) => boolean;
    error: (input: I) => { code: C; message: string; details?: T };
}) => ({
    when,
    error: (input: I) => {
        const { code, message, details } = error(input);
        return err('string', code, message, {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            constraint: details,
        });
    },
});

// ---

const minLengthConstraint = (minLength: number) =>
    stringConstraint({
        when: (input) => input.length < minLength,
        error: () => ({
            code: 'E_MIN_STRING_LENGTH',
            message: 'input does not have the required minimum length',
            details: {
                expected: {
                    type: 'string',
                    minLength,
                },
            },
        }),
    });

const emailConstraint = () =>
    stringConstraint({
        when: (input) =>
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
        error: () => ({
            code: 'E_NOT_A_EMAIL_ADDRESS',
            message: 'it is not a valid email address',
            details: {
                expected: {
                    type: 'string',
                },
            },
        }),
    });
