import { type EmailPayload } from '../types/email';

export type EmailRequestBody = {
    payload?: EmailPayload;
} & Partial<EmailPayload>;
