import { expect } from 'chai';

export const tsExpect = <Expectation, Expected extends Expectation>(
    expectation: Expectation,
    expected: Expected,
) => expect(expectation).to.eql(expected);
