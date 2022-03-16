/* eslint-disable @typescript-eslint/no-explicit-any */
import { literal } from './literal';
import { tsExpect } from './test-utils';

describe('literal.ts', () => {
    it("should return status: 'SUCCESS' with correct input for a string literal", () => {
        const either = literal('A').validate('A');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 'A',
        });
    });

    it("should return status: 'SUCCESS' with correct input for a number literal", () => {
        const either = literal(42).validate(42);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: 42,
        });
    });

    it("should return status: 'SUCCESS' with correct input for a boolean literal", () => {
        const either = literal(true).validate(true);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: true,
        });
    });

    it("should return status: 'FAILURE' with incorrect input for a string literal", () => {
        const input = 42 as any;

        const either = literal('A').validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'literal',
                code: 'E_NO_LITERAL',
                message: 'input is not of type: "literal("A")"',
                details: {
                    expectedType: 'literal',
                    providedType: 'number',
                    providedNativeType: 'number',
                    providedValue: input,
                },
            },
        });
    });

    it("should return status: 'FAILURE' with incorrect input for a number literal", () => {
        const input = 1 as any;

        const either = literal(42).validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'literal',
                code: 'E_NO_LITERAL',
                message: 'input is not of type: "literal(42)"',
                details: {
                    expectedType: 'literal',
                    providedType: 'number',
                    providedNativeType: 'number',
                    providedValue: input,
                },
            },
        });
    });

    it("should return status: 'FAILURE' with incorrect input for a boolean literal", () => {
        const input = 1 as any;

        const either = literal(true).validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'literal',
                code: 'E_NO_LITERAL',
                message: 'input is not of type: "literal(true)"',
                details: {
                    expectedType: 'literal',
                    providedType: 'number',
                    providedNativeType: 'number',
                    providedValue: input,
                },
            },
        });
    });
});
