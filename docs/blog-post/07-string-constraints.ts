import { err, getDisplayType } from '../../lib/internal-utils';

// ---

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
                type: typeof input,
                value: input,
            },
            constraint: details,
        });
    },
});

type Constraint = ReturnType<typeof stringConstraint>;
