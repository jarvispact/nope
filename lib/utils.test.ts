import { expect, it } from 'vitest';
import { inputToDisplayString, InputToDisplayStringOptions } from './utils';

type Testcase = { input: unknown; displayString: string; options?: InputToDisplayStringOptions };

const testcases: Testcase[] = [
    { input: undefined, displayString: 'undefined' },
    { input: null, displayString: 'null' },
    { input: '', displayString: "''" },
    { input: 'abc', displayString: "'abc'" },
    { input: '42', displayString: "'42'" },
    { input: true, displayString: 'true' },
    { input: false, displayString: 'false' },
    { input: 0, displayString: '0' },
    { input: 42, displayString: '42' },
    { input: -42, displayString: '-42' },
    { input: new Date(), displayString: 'Date' },
    { input: [], displayString: '[]' },
    { input: ['a', 42], displayString: "[ 'a', 42 ]" },
    { input: ['a', 42, true], displayString: "[ 'a', 42, true ]" },
    { input: ['a', 42, {}, true], displayString: "[ 'a', 42, {}, + 1 more ]" },
    {
        input: ['a', 42, {}, true],
        displayString: "[ 'a', 42, {}, true ]",
        options: { maxArrayDisplayProperties: 4 },
    },
    { input: {}, displayString: '{}' },
    { input: { a: 'a' }, displayString: "{ a: 'a' }" },
    { input: { a: 'a', b: 42 }, displayString: "{ a: 'a', b: 42 }" },
    { input: { a: 'a', b: 42, c: true }, displayString: "{ a: 'a', b: 42, c: true }" },
    { input: { a: 'a', b: 42, c: { d: 'd' }, e: true }, displayString: "{ a: 'a', b: 42, c: { d: 'd' }, + 1 more }" },
    {
        input: { a: 'a', b: 42, c: { d: 'd' }, e: true },
        displayString: "{ a: 'a', b: 42, c: { d: 'd' }, e: true }",
        options: { maxObjectDisplayProperties: 4 },
    },
];

it.each(testcases)('[inputToDisplayString] should return a string representation of the given input', (testcase) => {
    expect(inputToDisplayString(testcase.input, testcase.options)).to.eql(testcase.displayString);
});
