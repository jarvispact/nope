import { Schema } from './utils';
export declare const optional: <I, O extends I, E>(wrappedSchema: Schema<I, O, E>) => Schema<I | undefined, O | undefined, E>;
