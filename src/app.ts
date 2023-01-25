import express, { Application } from 'express';
import { createList, getList } from './logic';

const app: Application = express();
app.use(express.json());

app.post('/purchaseList', createList);
app.get('/purchaseList', getList);

app.listen(3000, () => {
    console.log('Server is running! 🚀');
});