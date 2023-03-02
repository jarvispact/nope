import { expect, it } from 'vitest';
import { StringSchema } from './string';
import { ok } from './utils';

type OkTestcase = { input: string };

const okTestcases: OkTestcase[] = [{ input: '' }, { input: 'abc' }, { input: '42' }];

it.each(okTestcases)(
    '[StringSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = StringSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any };

const errTestcases: ErrTestcase[] = [
    { input: undefined },
    { input: null },
    { input: 42 },
    { input: true },
    { input: [] },
    { input: {} },
];

it.each(errTestcases)(
    '[StringSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = StringSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_STRING',
            }),
        });
    },
);
