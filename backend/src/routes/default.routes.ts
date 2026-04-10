import { Request, Response } from 'express';
import express from 'express';

const defaultRouter = express.Router();

defaultRouter.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

export default defaultRouter
