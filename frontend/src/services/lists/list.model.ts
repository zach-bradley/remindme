export interface List {
    id: string;
    name: string;
    store: string;
    userId: string;
    items: Item[];
    createdAt: string;
    updatedAt: string;
}

export interface ListInput {
    name: string;
    store: string;
}

export interface Item {
    id: string;
    name: string;
    quantity: number;
    checked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ItemInput {
    name: string;
    quantity: number;
}