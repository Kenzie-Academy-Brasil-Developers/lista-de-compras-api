import express, { Application } from 'express';

import { createList, deleteList, deleteListItem, getList, getListById } from './logic';

const app: Application = express();
app.use(express.json());

app.post('/purchaseList', createList);
app.get('/purchaseList', getList);
app.get('/purchaseList/:id', getListById);
app.delete('/purchaseList/:listId/:itemName', deleteListItem);
app.delete('/purchaseList/:listId', deleteList);

app.listen(3000, () => {
    console.log('Server is running! 🚀');
});