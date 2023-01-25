interface IListData {
    name: string;
    quantity: string;
}

export interface IOrderListRequest {
    listName: string;
    data: Array<IListData>;
}

export interface IOrderList extends IOrderListRequest {
    id: number;
}