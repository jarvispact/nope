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
        return {
            schema: 'string' as const,
            code,
            message,
            details: {
                provided: {
                    type: typeof input,
                    value: input,
                },
                constraint: details,
            },
        };
    },
});

type Constraint = ReturnType<typeof stringConstraint>;
