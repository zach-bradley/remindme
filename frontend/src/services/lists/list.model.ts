export interface Item {
    id: string;
    name: string;
    quantity: number;
    checked: boolean;
}

export interface List {
    id: string;
    name: string;
    store: string;
    items: Item[];
    user_id: string;
}

export interface ItemInput {
    name: string;
    quantity: number;
    listId: string;
}

export interface ListInput {
    name: string;
    store: string;
}