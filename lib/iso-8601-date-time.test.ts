import { expect, it } from 'vitest';
import { Iso8601DateTimeSchema } from './iso-8601-date-time';
import { InferErrorType, ok } from './utils';

type OkTestcase = { input: string };

const okTestcases: OkTestcase[] = [
    { input: '2000-01-01T00:00' },
    { input: '2000-12-31T00:00:00' },
    { input: '2000-02-20T00:00:00.000' },

    { input: '2000-01-01T00:00Z' },
    { input: '2000-12-31T00:00:00Z' },
    { input: '2000-02-20T00:00:00.000Z' },

    { input: '2000-01-01T00:00+01:00' },
    { input: '2000-12-31T00:00:00+01:00' },
    { input: '2000-02-20T00:00:00.000+01:00' },

    { input: '2000-01-01T00:00-01:00' },
    { input: '2000-12-31T00:00:00-01:00' },
    { input: '2000-02-20T00:00:00.000-01:00' },
];

it.each(okTestcases)(
    '[Iso8601DateTimeSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = Iso8601DateTimeSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any; code: InferErrorType<typeof Iso8601DateTimeSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_STRING' },
    { input: null, code: 'E_STRING' },
    { input: 42, code: 'E_STRING' },
    { input: true, code: 'E_STRING' },
    { input: [], code: 'E_STRING' },
    { input: {}, code: 'E_STRING' },

    { input: '', code: 'E_ISO_8601_DATE_TIME' },
    { input: '200', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-00', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-00-', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-00-0', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-0-00', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-0000', code: 'E_ISO_8601_DATE_TIME' },
    { input: '20000000', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000:00:00', code: 'E_ISO_8601_DATE_TIME' },

    { input: '2000-00-00', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-13-00', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-12-32', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-13-01', code: 'E_ISO_8601_DATE_TIME' },

    { input: '2000-01-01T', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:0', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:0', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:00.', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:00.0', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:00.00', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:00.0Z', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:00.00Z', code: 'E_ISO_8601_DATE_TIME' },
    { input: '2000-01-01T00:00:00.000A', code: 'E_ISO_8601_DATE_TIME' },
];

it.each(errTestcases)(
    '[Iso8601DateTimeSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = Iso8601DateTimeSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
