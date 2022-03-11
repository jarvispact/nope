/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEmail, email } from './email';
import { tsExpect } from './test-utils';

describe('email.ts', () => {
    it("should return status: 'SUCCESS' with a valid email address", () => {
        const either = email.validate('test@test.com');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: createEmail('test@test.com'),
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_EMAIL' with a invalid email address input", () => {
        const either = email.validate('test');

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'email',
                    code: 'E_NO_EMAIL',
                    message: 'input is not of type: "email"',
                    details: {
                        expectedType: 'email',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: 'test',
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_EMAIL' with a number input", () => {
        const input = '42' as any;

        const either = email.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'email',
                    code: 'E_NO_EMAIL',
                    message: 'input is not of type: "email"',
                    details: {
                        expectedType: 'email',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: input,
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_STRING', 'E_NO_EMAIL'] with a number input", () => {
        const input = 42 as any;

        const either = email.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
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
                {
                    uri: 'email',
                    code: 'E_NO_EMAIL',
                    message: 'input is not of type: "email"',
                    details: {
                        expectedType: 'email',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
