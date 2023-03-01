/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, InferInputType, InferType, Schema, schema, validation } from './utils';

type TupleInput<Tuple extends [...Schema<string, any, any, any>[]]> = {
    [Index in keyof Tuple]: InferInputType<Tuple[Index]>;
};

type TupleOutput<Tuple extends [...Schema<string, any, any, any>[]]> = {
    [Index in keyof Tuple]: InferType<Tuple[Index]>;
};

type TupleEither<Tuple extends [...Schema<string, any, any, any>[]]> = {
    [Index in keyof Tuple]: ReturnType<Tuple[Index]['validate']>;
};

export const TupleValidation = <Items extends Schema<string, any, any, any>[]>(items: Items) =>
    validation({
        is: (input): input is TupleOutput<Items> =>
            Array.isArray(input) && items.every((item, idx) => item.is(input[idx])),
        err: (input, ctx) => {
            if (!Array.isArray(input)) return createError({ code: 'E_TUPLE' })(input, ctx);
            return createError({
                code: 'E_TUPLE_ITEM',
                details: { items: items.map((item, idx) => item.validate(input[idx])) as TupleEither<Items> },
            })(input, ctx);
        },
    });

export const TupleSchema = <Items extends Schema<string, any, any, any>[]>(...items: Items) =>
    schema({
        uri: 'TupleSchema',
        displayString: `TupleSchema( [ ${items.map((item) => item.displayString).join(', ')} ] )`,
        create: (input: TupleInput<Items>) => input as TupleOutput<Items>,
        validation: TupleValidation(items),
    });
