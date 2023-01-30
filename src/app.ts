import express, { Application } from 'express';

import { createList, deleteList, deleteListItem, getList, getListById, saveLastList, updateListItem } from './logic';
import { iValidListId } from './middlewares';

const app: Application = express();
app.use(express.json());
app.use('/purchaseList', saveLastList);

app.post('/purchaseList', createList);
app.get('/purchaseList', getList);
app.get('/purchaseList/:listId', iValidListId, getListById);
app.delete('/purchaseList/:listId/:itemName', iValidListId, deleteListItem);
app.delete('/purchaseList/:listId', iValidListId, deleteList);
app.patch('/purchaseList/:listId/:itemName', iValidListId, updateListItem);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/ 🚀');
});