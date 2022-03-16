/* eslint-disable @typescript-eslint/no-explicit-any */
import { boolean } from './boolean';
import { tsExpect } from './test-utils';

describe('number.ts', () => {
    it("should return status: 'SUCCESS' for input of type string", () => {
        const either = boolean.validate(true);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: true,
        });
    });

    it("should return status: 'FAILURE' for input of type number", () => {
        const input = '42' as any;

        const either = boolean.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'boolean',
                code: 'E_NO_BOOLEAN',
                message: 'input is not of type: "boolean"',
                details: {
                    expectedType: 'boolean',
                    providedType: 'string',
                    providedNativeType: 'string',
                    providedValue: input,
                },
            },
        });
    });
});
