import { expect, it } from 'vitest';
import { NumberSchema } from './number';
import { ok } from './utils';

type OkTestcase = { input: number };

const okTestcases: OkTestcase[] = [{ input: 0 }, { input: 42 }, { input: -42 }];

it.each(okTestcases)(
    '[NumberSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = NumberSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

type ErrTestcase = { input: unknown };

const errTestcases: ErrTestcase[] = [
    { input: undefined },
    { input: null },
    { input: true },
    { input: '' },
    { input: 'abc' },
    { input: '42' },
    { input: [] },
    { input: {} },
];

it.each(errTestcases)(
    '[NumberSchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = NumberSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_NUMBER',
            }),
        });
    },
);
