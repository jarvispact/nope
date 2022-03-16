/* eslint-disable @typescript-eslint/no-explicit-any */
import { string } from './string';
import { union } from './union';
import { tsExpect } from './test-utils';
import { literal } from './literal';
import { number } from './number';

describe('union.ts', () => {
    it("should return status: 'SUCCESS' for input of type 'string'", () => {
        const schema = union([string, number]);
        const either = schema.validate('test');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 'test',
        });
    });

    it("should return status: 'SUCCESS' for input of type 'number'", () => {
        const schema = union([string, number]);
        const either = schema.validate(42);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 42,
        });
    });

    it("should return status: 'SUCCESS' for input of type 'A'", () => {
        const schema = union([literal('A'), literal('B')]);
        const either = schema.validate('A');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 'A',
        });
    });

    it("should return status: 'SUCCESS' for input of type 'B'", () => {
        const schema = union([literal('A'), literal('B')]);
        const either = schema.validate('B');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 'B',
        });
    });

    it("should return status: 'FAILURE' for input of type 'boolean'", () => {
        const input = true as any;
        const schema = union([string, number]);
        const either = schema.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'union',
                code: 'E_NO_UNION',
                message: 'input is not of type: "union([string, number])"',
                details: {
                    expectedType: 'union',
                    providedType: 'boolean',
                    providedNativeType: 'boolean',
                    providedValue: input,
                },
            },
        });
    });

    it("should return status: 'FAILURE' for input of type 'C'", () => {
        const input = 'C' as any;
        const schema = union([literal('A'), literal('B')]);
        const either = schema.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'union',
                code: 'E_NO_UNION',
                message:
                    'input is not of type: "union([literal("A"), literal("B")])"',
                details: {
                    expectedType: 'union',
                    providedType: 'string',
                    providedNativeType: 'string',
                    providedValue: input,
                },
            },
        });
    });
});
