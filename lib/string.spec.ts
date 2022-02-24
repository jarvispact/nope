/* eslint-disable @typescript-eslint/no-explicit-any */
import { string } from './string';
import { tsExpect } from './test-utils';

describe('string.ts', () => {
    it("should return status: 'SUCCESS' for input of type string", () => {
        const schema = string();
        const either = schema.validate('test');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 'test',
        });
    });

    it("should return status: 'FAILURE' for input of type number", () => {
        const schema = string();
        const input = 42 as any;

        const either = schema.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
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
        });
    });
});
