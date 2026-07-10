import type { ParamsDictionary, RequestHandler } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export type AppRequestHandler<
    ReqBody = unknown,
    ReqQuery = ParsedQs,
    Params = ParamsDictionary,
    ResBody = unknown,
> = RequestHandler<Params, ResBody, ReqBody, ReqQuery>;
