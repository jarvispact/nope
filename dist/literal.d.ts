import { Schema } from './utils';
declare type LiteralSchema<I, O extends I, E> = Schema<I, O, E> & {
    literal: O;
};
export declare const literal: <Literal extends string | number>(l: Literal) => LiteralSchema<Literal, Literal, {
    schema: "string-literal" | "number-literal";
    code: "E_INVALID_STRING_LITERAL" | "E_INVALID_NUMBER_LITERAL";
    message: string;
    details: {
        provided: {
            type: string;
            value: string | number;
        };
        expected: {
            type: string;
            literal: string | number;
        };
    };
}>;
export {};
