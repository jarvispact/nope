/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { email } from './email';

describe.only('email.ts', () => {
    it("should return status: 'SUCCESS' with a valid email address", () => {
        const schema = email();
        expect(schema.validate('test@test.com')).to.eql({
            status: 'SUCCESS',
            value: 'test@test.com',
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_EMAIL' with a invalid email address input", () => {
        const schema = email();
        expect(schema.validate('test')).to.eql({
            status: 'FAILURE',
            value: [
                {
                    uri: 'email',
                    code: 'E_NO_EMAIL',
                    message: 'input is not of type: "email"',
                    details: {
                        expectedType: 'email',
                        providedValue: 'test',
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_EMAIL' with a number input", () => {
        const schema = email();
        const input = '42' as any;
        expect(schema.validate(input)).to.eql({
            status: 'FAILURE',
            value: [
                {
                    uri: 'email',
                    code: 'E_NO_EMAIL',
                    message: 'input is not of type: "email"',
                    details: {
                        expectedType: 'email',
                        providedValue: input,
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_STRING', 'E_NO_EMAIL'] with a number input", () => {
        const schema = email();
        const input = 42 as any;
        expect(schema.validate(input)).to.eql({
            status: 'FAILURE',
            value: [
                {
                    uri: 'string',
                    code: 'E_NO_STRING',
                    message: 'input is not of type: "string"',
                    details: {
                        expectedType: 'string',
                        providedValue: input,
                    },
                },
                {
                    uri: 'email',
                    code: 'E_NO_EMAIL',
                    message: 'input is not of type: "email"',
                    details: {
                        expectedType: 'email',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
