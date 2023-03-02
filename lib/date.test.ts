import { expect, it } from 'vitest';
import { DateSchema } from './date';
import { ok } from './utils';

type OkTestcase = { input: Date };

const okTestcases: OkTestcase[] = [
    { input: new Date() },
    { input: new Date('2000-01-01') },
    { input: new Date(Date.now()) },
];

it.each(okTestcases)(
    '[DateSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = DateSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any };

const errTestcases: ErrTestcase[] = [
    { input: undefined },
    { input: null },
    { input: 42 },
    { input: 'abc' },
    { input: true },
    { input: [] },
    { input: {} },
    { input: new Date('20000101') },
];

it.each(errTestcases)(
    '[DateSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = DateSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_DATE',
            }),
        });
    },
);
