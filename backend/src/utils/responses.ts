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

export const Unauthorized = (res: Response, details: { data?: any, msg?: string }) => {
  const msg = details.msg || 'Ok';
  res.status(Code.UNAUTHORIZED).json(new HttpResponse(Code.OK, msg, details.data));
};

export enum Code {
  OK = 200,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  CREATED = 201,
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
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}

