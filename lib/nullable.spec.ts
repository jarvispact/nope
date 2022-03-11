/* eslint-disable @typescript-eslint/no-explicit-any */
import { nullable } from './nullable';
import { string } from './string';
import { tsExpect } from './test-utils';

describe('nullable.ts', () => {
    it("should return status: 'SUCCESS' for input of type string", () => {
        const either = nullable(string).validate('test');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 'test',
        });
    });

    it("should return status: 'SUCCESS' for input of type null", () => {
        const either = nullable(string).validate(null);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: null,
        });
    });

    it("should return status: 'FAILURE' for input of type number", () => {
        const input = 42 as any;

        const either = nullable(string).validate(input);

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

    it("should return status: 'FAILURE' for input of type undefined", () => {
        const input = undefined as any;

        const either = nullable(string).validate(input);

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
                    providedType: 'undefined',
                    providedNativeType: 'undefined',
                    providedValue: input,
                },
            },
        });
    });
});
