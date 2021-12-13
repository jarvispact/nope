/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { date, dateConstraint } from './date';

describe('date.ts', () => {
    describe('without constraints', () => {
        it("should return status: 'SUCCESS' for input of type date", () => {
            const schema = date();
            const input = new Date();
            expect(schema.validate(input)).to.eql({
                status: 'SUCCESS',
                value: input,
            });
        });
        it("should return status: 'FAILURE' for input of type number", () => {
            const schema = date();
            const input = 42 as any;
            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'date',
                        code: 'E_NOT_A_DATE',
                        message: 'provided value is not of type date',
                        details: {
                            provided: {
                                type: 'number',
                                value: input,
                            },
                            expected: {
                                type: 'date',
                            },
                        },
                    },
                ],
            });
        });
    });

    describe('constraints argument validation', () => {
        it('should throw an error if a empty constraints array was passed', () => {
            expect(() => date([])).to.throw(
                /date\(\) was called with an empty constraints array. provide at least 1 constraint or call date\(\) without array argument\./,
            );
        });
    });

    describe('minYearConstraint', () => {
        const minYearConstraint = (minYear: number) =>
            dateConstraint({
                when: (input) => input.getFullYear() <= minYear,
                error: () => ({
                    code: 'E_MIN_DATE_YEAR',
                    message: `provided date has a year that is before the specified minYear: "${minYear}"`,
                    details: {
                        expected: {
                            type: 'date',
                            minYear,
                        },
                    },
                }),
            });

        it("should return status: 'SUCCESS' when satisfies constraint", () => {
            const schema = date([minYearConstraint(1900)]);
            const input = new Date();
            expect(schema.validate(input)).to.eql({
                status: 'SUCCESS',
                value: input,
            });
        });

        it("should return status: 'FAILURE' and error.codes: ['E_MIN_DATE_YEAR']", () => {
            const schema = date([minYearConstraint(1900)]);
            const input = new Date(1800, 1, 1);
            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'date',
                        code: 'E_MIN_DATE_YEAR',
                        message: `provided date has a year that is before the specified minYear: "1900"`,
                        details: {
                            provided: {
                                type: 'date',
                                value: input,
                            },
                            constraint: {
                                expected: {
                                    minYear: 1900,
                                    type: 'date',
                                },
                            },
                        },
                    },
                ],
            });
        });
    });

    describe('minYearConstraint and startsWithConstraint', () => {
        const minYearConstraint = (minYear: number) =>
            dateConstraint({
                when: (input) => input.getFullYear() <= minYear,
                error: () => ({
                    code: 'E_MIN_DATE_YEAR',
                    message: `provided date has a year that is before the specified minYear: "${minYear}"`,
                    details: {
                        expected: {
                            type: 'date',
                            minYear,
                        },
                    },
                }),
            });

        const minMonthConstraint = (minMonth: number) =>
            dateConstraint({
                when: (input) => input.getMonth() <= minMonth,
                error: () => ({
                    code: 'E_MIN_DATE_MONTH',
                    message: `provided date has a month that is before the specified minMonth: "${minMonth}"`,
                    details: {
                        expected: {
                            type: 'date',
                            minMonth,
                        },
                    },
                }),
            });

        it("should return status: 'SUCCESS' when satisfies constraint", () => {
            const schema = date([
                minYearConstraint(1900),
                minMonthConstraint(2),
            ]);

            const input = new Date();

            expect(schema.validate(input)).to.eql({
                status: 'SUCCESS',
                value: input,
            });
        });

        it("should return status: 'FAILURE' and error.codes: ['E_MIN_DATE_YEAR', 'E_MIN_DATE_MONTH']", () => {
            const schema = date([
                minYearConstraint(1900),
                minMonthConstraint(2),
            ]);

            const input = new Date(1800, 1, 1);

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'date',
                        code: 'E_MIN_DATE_YEAR',
                        message: `provided date has a year that is before the specified minYear: "1900"`,
                        details: {
                            provided: {
                                type: 'date',
                                value: input,
                            },
                            constraint: {
                                expected: {
                                    minYear: 1900,
                                    type: 'date',
                                },
                            },
                        },
                    },
                    {
                        schema: 'date',
                        code: 'E_MIN_DATE_MONTH',
                        message: `provided date has a month that is before the specified minMonth: "2"`,
                        details: {
                            provided: {
                                type: 'date',
                                value: input,
                            },
                            constraint: {
                                expected: {
                                    type: 'date',
                                    minMonth: 2,
                                },
                            },
                        },
                    },
                ],
            });
        });
    });
});
