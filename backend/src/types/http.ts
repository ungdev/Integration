import type { RequestHandler } from 'express';

export type AppRequestHandler<
    ReqBody = unknown,
    ReqQuery = Record<string, string | string[] | undefined>,
    Params = Record<string, string>,
    ResBody = unknown,
> = RequestHandler<Params, ResBody, ReqBody, ReqQuery>;
