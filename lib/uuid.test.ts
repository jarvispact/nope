import { expect, it } from 'vitest';
import { UuidSchema } from './uuid';
import { InferErrorType, ok } from './utils';

type OkTestcase = { input: string };

const okTestcases: OkTestcase[] = [
    { input: '00000000-0000-0000-0000-000000000000' },
    { input: '7b0baf93-3c72-4e17-afda-6236b662e94c' },
];

it.each(okTestcases)(
    '[UuidSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = UuidSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any; code: InferErrorType<typeof UuidSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_STRING' },
    { input: null, code: 'E_STRING' },
    { input: 42, code: 'E_STRING' },
    { input: true, code: 'E_STRING' },
    { input: [], code: 'E_STRING' },
    { input: {}, code: 'E_STRING' },

    { input: '', code: 'E_UUID' },
    { input: 'abc', code: 'E_UUID' },
    { input: '7b0baf93-3c72.4e17-afda-6236b662e94c', code: 'E_UUID' },
];

it.each(errTestcases)(
    '[UuidSchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = UuidSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
