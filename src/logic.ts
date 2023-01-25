import { Request, Response } from 'express';

import { internalData } from './database';
import { IOrderList, IOrderListRequest } from './interfaces';

export const createList = (req: Request, res: Response): Response => {
    const orderData: IOrderListRequest = req.body;
    const id: number = Math.floor(Math.random() * 1000);

    const newOrderData: IOrderList = {
        ...orderData,
        id,
    };

    internalData.push(newOrderData);

    return res.status(201).json(newOrderData);
};

export const getList = (req: Request, res: Response): Response => {
    return res.json(internalData);
};

export const getListById = (req: Request, res: Response): Response => {
    const orderFound: IOrderList | undefined = internalData.find(elem => elem.id === +req.params.id);
    return res.status(200).json(orderFound);
};