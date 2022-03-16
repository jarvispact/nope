/* eslint-disable @typescript-eslint/no-explicit-any */
import { number } from './number';
import { tsExpect } from './test-utils';

describe('number.ts', () => {
    it("should return status: 'SUCCESS' for input of type string", () => {
        const either = number.validate(42);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 42,
        });
    });

    it("should return status: 'FAILURE' for input of type number", () => {
        const input = '42' as any;

        const either = number.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
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
        });
    });
});
