/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { getDisplayType } from './internal-utils';
import { string, stringConstraint } from './string';

describe('string.ts', () => {
    describe('without constraints', () => {
        it("should return status: 'SUCCESS' for input of type string", () => {
            const schema = string();
            expect(schema.validate('test')).to.eql({
                status: 'SUCCESS',
                value: 'test',
            });
        });
        it("should return status: 'FAILURE' for input of type number", () => {
            const schema = string();
            const input = 42 as any;
            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'string',
                        code: 'E_NOT_A_STRING',
                        message: 'provided value is not of type string',
                        details: {
                            provided: {
                                type: 'number',
                                value: input,
                            },
                            expected: {
                                type: 'string',
                            },
                        },
                    },
                ],
            });
        });
    });

    describe('constraints argument validation', () => {
        it('should throw an error if a empty constraints array was passed', () => {
            expect(() => string([])).to.throw(
                /string\(\) was called with an empty constraints array\. provide at least 1 constraint or call string\(\) without array argument\./,
            );
        });
    });

    describe('minLengthConstraint', () => {
        const minLengthConstraint = (minLength: number) =>
            stringConstraint({
                when: (input) => input.length <= minLength,
                error: (input) => ({
                    code: 'E_MIN_STRING_LENGTH',
                    message: `provided string is shorter than the specified minLength: "${minLength}"`,
                    details: {
                        provided: {
                            type: getDisplayType(input),
                            value: input,
                        },
                        expected: {
                            type: 'string',
                            minLength,
                        },
                    },
                }),
            });

        it("should return status: 'SUCCESS' when satisfies constraint", () => {
            const schema = string([minLengthConstraint(3)]);
            expect(schema.validate('test')).to.eql({
                status: 'SUCCESS',
                value: 'test',
            });
        });

        it("should return status: 'FAILURE' and error.codes: ['E_MIN_STRING_LENGTH']", () => {
            const schema = string([minLengthConstraint(3)]);
            expect(schema.validate('ab')).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'string',
                        code: 'E_MIN_STRING_LENGTH',
                        message: `provided string is shorter than the specified minLength: "3"`,
                        details: {
                            provided: {
                                type: 'string',
                                value: 'ab',
                            },
                            expected: {
                                minLength: 3,
                                type: 'string',
                            },
                        },
                    },
                ],
            });
        });
    });

    describe('minLengthConstraint and startsWithConstraint', () => {
        const minLengthConstraint = (minLength: number) =>
            stringConstraint({
                when: (input) => input.length <= minLength,
                error: (input) => ({
                    code: 'E_MIN_STRING_LENGTH',
                    message: `provided string is shorter than the specified minLength: "${minLength}"`,
                    details: {
                        provided: {
                            type: getDisplayType(input),
                            value: input,
                        },
                        expected: {
                            type: 'string',
                            minLength,
                        },
                    },
                }),
            });

        const startsWithConstraint = (startsWith: string) =>
            stringConstraint({
                when: (input) => !input.startsWith(startsWith),
                error: (input) => ({
                    code: 'E_STRING_STARTS_WITH',
                    message: `provided string does not startsWith: "${startsWith}"`,
                    details: {
                        provided: {
                            type: getDisplayType(input),
                            value: input,
                        },
                        expected: {
                            type: 'string',
                            startsWith,
                        },
                    },
                }),
            });

        it("should return status: 'SUCCESS' when satisfies constraint", () => {
            const schema = string([
                minLengthConstraint(3),
                startsWithConstraint('t'),
            ]);

            expect(schema.validate('test')).to.eql({
                status: 'SUCCESS',
                value: 'test',
            });
        });

        it("should return status: 'FAILURE' and error.codes: ['E_MIN_STRING_LENGTH', 'E_STRING_STARTS_WITH']", () => {
            const schema = string([
                minLengthConstraint(3),
                startsWithConstraint('t'),
            ]);

            expect(schema.validate('ab')).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'string',
                        code: 'E_MIN_STRING_LENGTH',
                        message: `provided string is shorter than the specified minLength: "3"`,
                        details: {
                            provided: {
                                type: 'string',
                                value: 'ab',
                            },
                            expected: {
                                minLength: 3,
                                type: 'string',
                            },
                        },
                    },
                    {
                        schema: 'string',
                        code: 'E_STRING_STARTS_WITH',
                        message: `provided string does not startsWith: "t"`,
                        details: {
                            provided: {
                                type: 'string',
                                value: 'ab',
                            },
                            expected: {
                                type: 'string',
                                startsWith: 't',
                            },
                        },
                    },
                ],
            });
        });
    });
});
