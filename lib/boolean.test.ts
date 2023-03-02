import { expect, it } from 'vitest';
import { BooleanSchema } from './boolean';
import { ok } from './utils';

type OkTestcase = { input: boolean };

const okTestcases: OkTestcase[] = [{ input: true }, { input: false }];

it.each(okTestcases)(
    '[BooleanSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = BooleanSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any };

const errTestcases: ErrTestcase[] = [
    { input: undefined },
    { input: 'abc' },
    { input: 42 },
    { input: null },
    { input: [] },
    { input: {} },
];

it.each(errTestcases)(
    '[BooleanSchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = BooleanSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_BOOLEAN',
            }),
        });
    },
);
