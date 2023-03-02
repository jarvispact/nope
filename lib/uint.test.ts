import { expect, it } from 'vitest';
import { UIntSchema } from './uint';
import { InferErrorType, ok } from './utils';

type OkTestcase = { input: number };

const okTestcases: OkTestcase[] = [{ input: 0 }, { input: 42 }];

it.each(okTestcases)(
    '[UIntSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = UIntSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any; code: InferErrorType<typeof UIntSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_NUMBER' },
    { input: null, code: 'E_NUMBER' },
    { input: 'abc', code: 'E_NUMBER' },
    { input: true, code: 'E_NUMBER' },
    { input: [], code: 'E_NUMBER' },
    { input: {}, code: 'E_NUMBER' },

    { input: 42.2, code: 'E_UINT' },
    { input: -42.1, code: 'E_UINT' },
    { input: 0.1, code: 'E_UINT' },
    { input: -42, code: 'E_UINT' },
];

it.each(errTestcases)(
    '[UIntSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = UIntSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
