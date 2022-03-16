import { Schema } from './utils';
export declare const nullable: <WrappedSchema extends Schema<any, any, any, any>>(wrappedSchema: WrappedSchema) => Schema<WrappedSchema["I"] | null, WrappedSchema["O"] | null, WrappedSchema["E"], "array">;
