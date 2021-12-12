/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { number, numberConstraint } from './number';
import { getDisplayType } from './utils';

describe('number.ts', () => {
    describe('without constraints', () => {
        it("should return status: 'SUCCESS' for input of type number", () => {
            const schema = number();
            expect(schema.validate(42)).to.eql({
                status: 'SUCCESS',
                value: 42,
            });
        });
        it("should return status: 'FAILURE' for input of type number", () => {
            const schema = number();
            const input = '42' as any;
            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'number',
                        code: 'E_NOT_A_NUMBER',
                        message: 'provided value is not of type number',
                        details: {
                            provided: {
                                type: 'string',
                                value: input,
                            },
                            expected: {
                                type: 'number',
                            },
                        },
                    },
                ],
            });
        });
    });

    describe('constraints argument validation', () => {
        it('should throw an error if a empty constraints array was passed', () => {
            expect(() => number([])).to.throw(
                /empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to number()/,
            );
        });
    });

    describe('minConstraint', () => {
        const minConstraint = (min: number) =>
            numberConstraint({
                when: (input) => input < min,
                error: (input) => ({
                    code: 'E_MIN_NUMBER',
                    message: `provided number is smaller than the specified minimum: "${min}"`,
                    details: {
                        provided: {
                            type: getDisplayType(input),
                            value: input,
                        },
                        expected: {
                            type: 'number',
                            min,
                        },
                    },
                }),
            });

        it("should return status: 'SUCCESS' when satisfies constraint", () => {
            const schema = number([minConstraint(3)]);
            expect(schema.validate(3)).to.eql({
                status: 'SUCCESS',
                value: 3,
            });
        });

        it("should return status: 'FAILURE' and error.codes: ['E_MIN_NUMBER']", () => {
            const schema = number([minConstraint(3)]);
            expect(schema.validate(2)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'number',
                        code: 'E_MIN_NUMBER',
                        message: `provided number is smaller than the specified minimum: "3"`,
                        details: {
                            provided: {
                                type: 'number',
                                value: 2,
                            },
                            expected: {
                                min: 3,
                                type: 'number',
                            },
                        },
                    },
                ],
            });
        });
    });

    describe('minLengthConstraint and startsWithConstraint', () => {
        const minConstraint = (min: number) =>
            numberConstraint({
                when: (input) => input <= min,
                error: (input) => ({
                    code: 'E_MIN_NUMBER',
                    message: `provided number is smaller than the specified minimum: "${min}"`,
                    details: {
                        provided: {
                            type: getDisplayType(input),
                            value: input,
                        },
                        expected: {
                            type: 'number',
                            min,
                        },
                    },
                }),
            });

        const isDivisibleByConstraint = (num: number) =>
            numberConstraint({
                when: (input) => input % num !== 0,
                error: (input) => ({
                    code: 'E_IS_DIVISIBLE_BY',
                    message: `provided number is not divisible by: "${num}"`,
                    details: {
                        provided: {
                            type: getDisplayType(input),
                            value: input,
                        },
                        expected: {
                            type: 'number',
                            isDivisibleBy: num,
                        },
                    },
                }),
            });

        it("should return status: 'SUCCESS' when satisfies constraint", () => {
            const schema = number([
                minConstraint(3),
                isDivisibleByConstraint(2),
            ]);

            expect(schema.validate(4)).to.eql({
                status: 'SUCCESS',
                value: 4,
            });
        });

        it("should return status: 'FAILURE' and error.codes: ['E_MIN_NUMBER', 'E_IS_DIVISIBLE_BY']", () => {
            const schema = number([
                minConstraint(3),
                isDivisibleByConstraint(2),
            ]);
            expect(schema.validate(1)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'number',
                        code: 'E_MIN_NUMBER',
                        message: `provided number is smaller than the specified minimum: "3"`,
                        details: {
                            provided: {
                                type: 'number',
                                value: 1,
                            },
                            expected: {
                                type: 'number',
                                min: 3,
                            },
                        },
                    },
                    {
                        schema: 'number',
                        code: 'E_IS_DIVISIBLE_BY',
                        message: `provided number is not divisible by: "2"`,
                        details: {
                            provided: {
                                type: 'number',
                                value: 1,
                            },
                            expected: {
                                type: 'number',
                                isDivisibleBy: 2,
                            },
                        },
                    },
                ],
            });
        });
    });
});
