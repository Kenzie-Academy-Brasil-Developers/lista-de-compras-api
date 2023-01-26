import { Request, Response } from 'express';

import { internalData } from './database';
import { IOrderList, IOrderListRequest } from './interfaces';

const validateDataOrder = (payload: any): IOrderListRequest => {
    const requiredMainKeys: Array<string> = ['listName', 'data'];
    const requiredSubKeys: Array<string> = ['name', 'quantity'];
    const mainKeys: Array<string> = Object.keys(payload);
    const subKeys: Array<string> = [];

    if (mainKeys.length !== 2) {
        throw new Error(`Updatable fields are: 'listName' and 'data'`);
    }

    const containsMainRequired: boolean = mainKeys.every((key: string) => requiredMainKeys.includes(key));
    if (!containsMainRequired) {
        throw new Error(`Updatable fields are: 'listName' and 'data'`);
    }

    payload.data.forEach((product: Object) => subKeys.push(...Object.keys(product)));

    const containsSubRequired: boolean = subKeys.every((key: string) => requiredSubKeys.includes(key));
    if (!containsSubRequired) {
        throw new Error(`Updatable fields are: 'name' and 'quantity'`);
    }

    return payload;
};

const validateTypeValue = (payload: any) => {
    const isExpected: boolean = payload.data.some((value: any) => typeof value.quantity !== 'string');
    if (isExpected) {
        throw new Error('The name and quantity need to be a string');
    } else if (typeof payload.listName !== 'string') {
        throw new Error('The list name need to be a string');
    }
};

const countId = (): number => {
    if (!internalData.length) {
        return 1;
    }

    return internalData[internalData.length - 1].id + 1;
};

export const createList = (req: Request, res: Response): Response => {
    try {
        const orderData: IOrderListRequest = validateDataOrder(req.body);
        const id: number = countId();
        validateTypeValue(req.body);

        const newOrderData: IOrderList = {
            ...orderData,
            id,
        };

        internalData.push(newOrderData);

        return res.status(201).json(newOrderData);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
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

const validateUpdateOrder = (payload: any) => {
    const requiredKeys: Array<string> = ['name', 'quantity'];
    const keys: Array<string> = Object.keys(payload);
    if (keys.length !== 2) {
        throw new Error(`Updatable fields are: 'name' and 'quantity'`);
    }

    const containsKeysRequired: boolean = keys.every((key: string) => requiredKeys.includes(key));
    if (!containsKeysRequired) {
        throw new Error(`Updatable fields are: 'name' and 'quantity'`);
    }
};

export const updateListItem = (req: Request, res: Response) => {
    try {
        const listFound: IOrderList | undefined = internalData.find((elem) => elem.id === +req.params.listId);
        if (!listFound) {
            return res.status(400).json({ message: `List with id '${req.params.listId}' does not exist` });
        }

        if (typeof req.body.name !== 'string' || typeof req.body.quantity !== 'string') {
            if (req.body.name && req.body.quantity) {
                return res.status(200).json({ message: 'The list name need to be a string' });
            }
        }

        validateUpdateOrder(req.body);

        if (!!listFound) {
            const itemFound = listFound.data.find((value) => value.name === req.params.itemName);

            if (!!itemFound) {
                itemFound.name = req.body.name;
                itemFound.quantity = req.body.quantity;
                return res.status(200).json(itemFound);
            } else {
                return res.status(404).json({ message: `Item with name '${req.params.itemName}' does not exist` });
            }
        }

    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};