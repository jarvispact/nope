import { string } from '../../lib/nope';

// ---

const schema = string();

type Input = typeof schema['I']; // string
type Output = typeof schema['O']; // string
type Error = typeof schema['E']; // StringError
