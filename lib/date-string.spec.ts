/* eslint-disable @typescript-eslint/no-explicit-any */
import { dateString } from './date-string';
import { tsExpect } from './test-utils';

describe('date-string.ts', () => {
    it("should return status: 'SUCCESS' with a valid date-string input", () => {
        const either = dateString.validate('1970-05-29');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: dateString.create('1970-05-29'),
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_DATE_STRING' with a invalid date-string input", () => {
        const either = dateString.validate('0000-00-00');

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'date-string',
                    code: 'E_NO_DATE_STRING',
                    message: 'input is not of type: "date-string"',
                    details: {
                        expectedType: 'date-string',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: '0000-00-00',
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_DATE_STRING' with a string input", () => {
        const input = '42' as any;

        const either = dateString.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'date-string',
                    code: 'E_NO_DATE_STRING',
                    message: 'input is not of type: "date-string"',
                    details: {
                        expectedType: 'date-string',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: input,
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_STRING', 'E_NO_DATE_STRING'] with a number input", () => {
        const input = 42 as any;

        const either = dateString.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'string',
                    code: 'E_NO_STRING',
                    message: 'input is not of type: "string"',
                    details: {
                        expectedType: 'string',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: input,
                    },
                },
                {
                    uri: 'date-string',
                    code: 'E_NO_DATE_STRING',
                    message: 'input is not of type: "date-string"',
                    details: {
                        expectedType: 'date-string',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
