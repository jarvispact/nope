/* eslint-disable @typescript-eslint/no-explicit-any */
import { dotcomEmail, createDotcomEmail } from './dotcom-email';
import { tsExpect } from './test-utils';

describe('dotcom-email.ts', () => {
    it("should return status: 'SUCCESS' with a valid .com email address", () => {
        const schema = dotcomEmail();
        const either = schema.validate('test@test.com');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: createDotcomEmail('test@test.com'),
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_EMAIL' with a invalid email address input", () => {
        const schema = dotcomEmail();
        const either = schema.validate('test@test.de');

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'dotcomEmail',
                    code: 'E_NO_DOT_COM_EMAIL',
                    message: 'input is not of type: "dotcomEmail"',
                    details: {
                        expectedType: 'dotcomEmail',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: 'test@test.de',
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_DOT_COM_EMAIL', 'E_NO_EMAIL'] with a string input", () => {
        const schema = dotcomEmail();
        const input = '42' as any;

        const either = schema.validate(input);

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
                {
                    uri: 'dotcomEmail',
                    code: 'E_NO_DOT_COM_EMAIL',
                    message: 'input is not of type: "dotcomEmail"',
                    details: {
                        expectedType: 'dotcomEmail',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: input,
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_DOT_COM_EMAIL', 'E_NO_EMAIL', 'E_NO_STRING'] with a number input", () => {
        const schema = dotcomEmail();
        const input = 42 as any;

        const either = schema.validate(input);

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
                {
                    uri: 'dotcomEmail',
                    code: 'E_NO_DOT_COM_EMAIL',
                    message: 'input is not of type: "dotcomEmail"',
                    details: {
                        expectedType: 'dotcomEmail',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
