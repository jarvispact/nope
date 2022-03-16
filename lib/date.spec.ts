/* eslint-disable @typescript-eslint/no-explicit-any */
import { date } from './date';
import { tsExpect } from './test-utils';

describe('date.ts', () => {
    it("should return status: 'SUCCESS' for input of type string", () => {
        const d = new Date();
        const either = date.validate(d);

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: d,
        });
    });

    it("should return status: 'FAILURE' for input of type number", () => {
        const input = 42 as any;

        const either = date.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'date',
                code: 'E_NO_DATE',
                message: 'input is not of type: "date"',
                details: {
                    expectedType: 'date',
                    providedType: 'number',
                    providedNativeType: 'number',
                    providedValue: input,
                },
            },
        });
    });

    it("should return status: 'FAILURE' witrh invalid date input", () => {
        const d = new Date('whaaat');
        const either = date.validate(d);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: {
                uri: 'date',
                code: 'E_NO_DATE',
                message: 'input is not of type: "date"',
                details: {
                    expectedType: 'date',
                    providedType: 'date',
                    providedNativeType: 'object',
                    providedValue: d,
                },
            },
        });
    });
});
