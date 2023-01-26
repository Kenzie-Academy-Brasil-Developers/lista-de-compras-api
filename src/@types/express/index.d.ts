import { IOrderList } from '../../interfaces';

declare global {
    namespace Express {
        interface Request {
            lastList: IOrderList;
        }
    }
}