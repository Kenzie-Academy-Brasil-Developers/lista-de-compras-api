import express, { Application } from 'express';

import { createList, getList, getListById } from './logic';

const app: Application = express();
app.use(express.json());

app.post('/purchaseList', createList);
app.get('/purchaseList', getList);
app.get('/purchaseList/:id', getListById);

app.listen(3000, () => {
    console.log('Server is running! 🚀');
});