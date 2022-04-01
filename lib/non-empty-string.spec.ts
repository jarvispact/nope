/* eslint-disable @typescript-eslint/no-explicit-any */
import { nonEmptyString } from './non-empty-string';
import { tsExpect } from './test-utils';

describe('non-empty-string.ts', () => {
    it("should return status: 'SUCCESS' with a valid non-empty-string input", () => {
        const either = nonEmptyString.validate('test');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: nonEmptyString.create('test'),
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NON_EMPTY_STRING' with a invalid non-empty-string input", () => {
        const either = nonEmptyString.validate('');

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'non-empty-string',
                    code: 'E_NON_EMPTY_STRING',
                    message: 'input is not of type: "non-empty-string"',
                    details: {
                        expectedType: 'non-empty-string',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: '',
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_STRING', 'E_NON_EMPTY_STRING'] with a number input", () => {
        const input = 42 as any;

        const either = nonEmptyString.validate(input);

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
                    uri: 'non-empty-string',
                    code: 'E_NON_EMPTY_STRING',
                    message: 'input is not of type: "non-empty-string"',
                    details: {
                        expectedType: 'non-empty-string',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
