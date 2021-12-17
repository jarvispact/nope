import { record, string, union, literal, Either } from '../../lib/nope';

const TodoSchema = record({
    id: string(),
    content: string(),
    status: union([literal('COMPLETE'), literal('INCOMPLETE')]),
});

// ---

// The signatue of the validate function
type I = typeof TodoSchema['I'];
type O = typeof TodoSchema['O'];
type E = typeof TodoSchema['E'];

type validate = (input: I) => Either<O, E>;

const either = TodoSchema.validate({
    id: '42',
    content: 'some content',
    status: 'INCOMPLETE',
});
