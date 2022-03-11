/* eslint-disable @typescript-eslint/no-explicit-any */
import { optional } from './optional';
import { string } from './string';
import { tsExpect } from './test-utils';

describe('optional.ts', () => {
    it("should return status: 'SUCCESS' for input of type string", () => {
        const either = optional(string).validate('test');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 'test',
        });
    });

    it("should return status: 'SUCCESS' for input of type undefined", () => {
        const either = optional(string).validate(undefined);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: undefined,
        });
    });

    it("should return status: 'FAILURE' for input of type number", () => {
        const input = 42 as any;

        const either = optional(string).validate(input);

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

    it("should return status: 'FAILURE' for input of type null", () => {
        const input = null as any;

        const either = optional(string).validate(input);

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
                    providedType: 'null',
                    providedNativeType: 'object',
                    providedValue: input,
                },
            },
        });
    });
});
