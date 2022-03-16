/* eslint-disable @typescript-eslint/no-explicit-any */
import { float } from './float';
import { tsExpect } from './test-utils';

describe('float.ts', () => {
    it("should return status: 'SUCCESS' with a valid float value", () => {
        const either = float.validate(42.42);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: float.create(42.42),
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_FLOAT' with a integer input", () => {
        const either = float.validate(42);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'float',
                    code: 'E_NO_FLOAT',
                    message: 'input is not of type: "float"',
                    details: {
                        expectedType: 'float',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: 42,
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_FLOAT', 'E_NO_NUMBER'] with a string input", () => {
        const input = '42' as any;

        const either = float.validate(input);

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
                    uri: 'float',
                    code: 'E_NO_FLOAT',
                    message: 'input is not of type: "float"',
                    details: {
                        expectedType: 'float',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
