/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { boolean } from './boolean';

describe('boolean.ts', () => {
    it("should return status: 'SUCCESS' with true as input", () => {
        const schema = boolean();
        expect(schema.validate(true)).to.eql({
            status: 'SUCCESS',
            value: true,
        });
    });

    it("should return status: 'SUCCESS' with false as input", () => {
        const schema = boolean();
        expect(schema.validate(false)).to.eql({
            status: 'SUCCESS',
            value: false,
        });
    });

    it("should return status: 'FAILURE' with a non-boolean value", () => {
        const schema = boolean();
        expect(schema.validate('B' as any)).to.eql({
            status: 'FAILURE',
            value: {
                schema: 'boolean',
                code: 'E_NOT_A_BOOLEAN',
                message: `provided value is not of type: "boolean"`,
                details: {
                    provided: {
                        type: 'string',
                        value: 'B',
                    },
                    expected: {
                        type: 'boolean',
                    },
                },
            },
        });
    });
});
