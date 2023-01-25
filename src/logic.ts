import { Request, Response } from 'express';
import { internalData } from './database';

export const createList = (req: Request, res: Response) => {

};

export const getList = (req: Request, res: Response) => {
    return res.json(internalData);
};