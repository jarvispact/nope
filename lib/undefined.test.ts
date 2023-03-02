import { expect, it } from 'vitest';
import { UndefinedSchema } from './undefined';
import { ok } from './utils';

type OkTestcase = { input: undefined };

const okTestcases: OkTestcase[] = [{ input: undefined }];

it.each(okTestcases)(
    '[UndefinedSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = UndefinedSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any };

const errTestcases: ErrTestcase[] = [
    { input: null },
    { input: 'abc' },
    { input: 42 },
    { input: true },
    { input: [] },
    { input: {} },
];

it.each(errTestcases)(
    '[UndefinedSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = UndefinedSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_UNDEFINED',
            }),
        });
    },
);
