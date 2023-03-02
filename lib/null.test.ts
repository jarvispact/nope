import { expect, it } from 'vitest';
import { NullSchema } from './null';
import { ok } from './utils';

type OkTestcase = { input: null };

const okTestcases: OkTestcase[] = [{ input: null }];

it.each(okTestcases)(
    '[NullSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = NullSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any };

const errTestcases: ErrTestcase[] = [
    { input: undefined },
    { input: 'abc' },
    { input: 42 },
    { input: true },
    { input: [] },
    { input: {} },
];

it.each(errTestcases)(
    '[NullSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = NullSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_NULL',
            }),
        });
    },
);
