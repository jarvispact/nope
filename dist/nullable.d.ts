import { Schema } from './utils';
export declare const nullable: <I, O extends I, E>(wrappedSchema: Schema<I, O, E>) => Schema<I | null, O | null, E>;
