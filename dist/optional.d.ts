import { Schema } from './utils';
export declare const optional: <WrappedSchema extends Schema<any, any, any, any>>(wrappedSchema: WrappedSchema) => Schema<WrappedSchema["I"] | undefined, WrappedSchema["O"] | undefined, WrappedSchema["E"], "optional">;
