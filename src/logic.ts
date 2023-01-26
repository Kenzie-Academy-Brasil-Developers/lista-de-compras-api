import { Request, Response } from 'express';

import { internalData } from './database';
import { IOrderList, IOrderListRequest } from './interfaces';

const validateDataOrder = (payload: any): IOrderListRequest => {
    const requiredMainKeys: Array<string> = ['listName', 'data'];
    const requiredSubKeys: Array<string> = ['name', 'quantity'];
    const mainKeys: Array<string> = Object.keys(payload);
    const subKeys: Array<string> = [];

    payload.data.forEach((product: Object) => subKeys.push(...Object.keys(product)));

    const containsMainRequired: boolean = mainKeys.every((key: string) => requiredMainKeys.includes(key));
    if (!containsMainRequired) {
        throw new Error(`Updatable fields are: 'listName' and 'data'`);
    }

    const containsSubRequired: boolean = subKeys.every((key: string) => requiredSubKeys.includes(key));
    if (!containsSubRequired) {
        throw new Error(`Updatable fields are: 'name' and 'quantity'`)
    }

    return payload;
};

export const createList = (req: Request, res: Response): Response => {
    const orderData: IOrderListRequest = validateDataOrder(req.body);
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

    if (!orderFound) {
        return res.status(404).json({ message: `List with id '${req.params.id}' does not exist` });
    }

    return res.status(200).json(orderFound);
};

export const deleteListItem = (req: Request, res: Response): Response => {
    const listFound: IOrderList | undefined = internalData.find(elem => elem.id === +req.params.listId);
    if (!listFound) {
        return res.status(404).json({ message: `List with id '${req.params.listId}' does not exist` });
    }

    const foundIndex: number = listFound.data.findIndex(product => product.name === req.params.itemName);
    if (foundIndex === -1) {
        return res.status(404).json({ message: `Item with name '${req.params.itemName}' does not exist` });
    }
    listFound.data.splice(foundIndex, 1);

    return res.status(204).json();
};

export const deleteList = (req: Request, res: Response): Response => {
    const foundIndex: number = internalData.findIndex(list => list.id === +req.params.listId);

    if (foundIndex === -1) {
        return res.status(404).json({ message: `List with id '${req.params.listId}' does not exist` });
    }
    internalData.splice(foundIndex, 1);

    return res.status(204).json();
};