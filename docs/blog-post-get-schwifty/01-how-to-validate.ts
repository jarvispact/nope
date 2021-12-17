import { record, string, union, literal, Either } from '../../lib/nope';

const TodoSchema = record({
    id: string(),
    content: string(),
    status: union([literal('COMPLETE'), literal('INCOMPLETE')]),
});

// ---

// The signatue of the validate function
type I = typeof TodoSchema['I']; // Input
type O = typeof TodoSchema['O']; // Output
type E = typeof TodoSchema['E']; // Error
type validate = (input: I) => Either<O, E>;

// lets validate some input data:
const either = TodoSchema.validate({
    id: '42',
    content: 'some content',
    status: 'INCOMPLETE',
});
