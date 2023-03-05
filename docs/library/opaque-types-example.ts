import { Email, EmailSchema } from '../../lib/email';
import { isOk } from '../../lib/utils';

// eslint-disable-next-line prettier/prettier
const sendEmail = (email: Email) => { /* TODO: send email */ };

// Argument of type 'string' is not assignable to parameter of type 'Email'.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
sendEmail('');

const either = EmailSchema.validate('tony@starkindustries.com');
if (isOk(either)) {
    // typeof email: `Email`
    const email = either.value;
    sendEmail(email);
}

const email = EmailSchema.create('tony@starkindustries.com');
sendEmail(email);
