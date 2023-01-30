import { NextFunction, Request, Response } from 'express';
import { internalData } from './database';
import { IOrderList } from './interfaces';

export const iValidListId = (req: Request, res: Response, next: NextFunction): Response | void => {
    const isFoundId: IOrderList | undefined = internalData.find(elme => elme.id === +req.params.listId);

    if (!isFoundId) {
        return res.status(404).json({ message: `List with id '${req.params.listId}' does not exist` });
    }

    return next();
};