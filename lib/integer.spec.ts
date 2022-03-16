/* eslint-disable @typescript-eslint/no-explicit-any */
import { integer } from './integer';
import { tsExpect } from './test-utils';

describe('integer.ts', () => {
    it("should return status: 'SUCCESS' with a valid integer value", () => {
        const either = integer.validate(42);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: integer.create(42),
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_INTEGER' with a float input", () => {
        const either = integer.validate(42.42);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'integer',
                    code: 'E_NO_INTEGER',
                    message: 'input is not of type: "integer"',
                    details: {
                        expectedType: 'integer',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: 42.42,
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_INTEGER', 'E_NO_NUMBER'] with a string input", () => {
        const input = '42' as any;

        const either = integer.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'number',
                    code: 'E_NO_NUMBER',
                    message: 'input is not of type: "number"',
                    details: {
                        expectedType: 'number',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: input,
                    },
                },
                {
                    uri: 'integer',
                    code: 'E_NO_INTEGER',
                    message: 'input is not of type: "integer"',
                    details: {
                        expectedType: 'integer',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
