import { Response } from 'express';

export const Error = (res: Response, details: { error?: any, msg?: string }) => {
    if (details.error) {
        console.error('Error:', details.error);
    }
    const msg = details.msg || 'An error occurred';
    return res.status(Code.BAD_REQUEST).json(new HttpResponse(Code.BAD_REQUEST, msg));
};

export const Created = (res: Response, details: { data?: any, msg?: string }) => {
    const msg = details.msg || 'Entity created';
    res.status(Code.CREATED).json(new HttpResponse(Code.CREATED, msg, details.data));
};

export const Ok = (res: Response, details: { data?: any, msg?: string }) => {
    const msg = details.msg || 'Ok';
    res.status(Code.OK).json(new HttpResponse(Code.OK, msg, details.data));
};

export const Accepted = (res: Response, details: { data?: any, msg?: string }) => {
    const msg = details.msg || 'Accepted';
    res.status(Code.OK).json(new HttpResponse(Code.ACCEPTED, msg, details.data));
};

export const Unauthorized = (res: Response, details: { data?: any, msg?: string }) => {
    const msg = details.msg || 'Unauthorized';
    res.status(Code.UNAUTHORIZED).json(new HttpResponse(Code.UNAUTHORIZED, msg, details.data));
};

export const Conflict = (res: Response, details: { data?: any, msg?: string }) => {
    const msg = details.msg || "Conflict";
    res.status(Code.CONFLICT).json(new HttpResponse(Code.CONFLICT, msg, details.data));
};

export const Teapot = (res: Response, details: { data?: any, msg?: string }) => {
    const msg = details.msg || "I'm a teapot";
    res.status(Code.IM_A_TEAPOT).json(new HttpResponse(Code.IM_A_TEAPOT, msg, details.data));
};

export enum Code {
    OK = 200,
    ACCEPTED = 202,
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    CREATED = 201,
    CONFLICT = 409,
    IM_A_TEAPOT = 418,
    ISE = 500
}

export class HttpResponse {
    private timeStamp: string;
    private httpStatus: string;

    constructor(private statusCode: Code, private message?: string, private data?: any) {
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = statusCode;
        this.httpStatus = this.getStatus();
        this.message = message;
        this.data = data;
    }

    private getStatus(): string {
        switch (this.statusCode) {
            case Code.OK:
                return 'OK';
            case Code.NOT_FOUND:
                return 'NOT_FOUND';
            case Code.BAD_REQUEST:
                return 'BAD_REQUEST';
            case Code.CREATED:
                return 'CREATED';
            case Code.ISE:
                return 'INTERNAL_SERVER_ERROR';
            case Code.UNAUTHORIZED:
                return 'UNAUTHORIZED';
            case Code.CONFLICT:
                return 'CONFLICT';
            case Code.IM_A_TEAPOT:
                return 'IM_A_TEAPOT';
        }
    }
}
