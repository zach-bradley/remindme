export interface List {
    id: string;
    title: string;
    description: string;
    userId: string;
    items: Item[];
    createdAt: string;
    updatedAt: string;
}

export interface ListInput {
    title: string;
    description: string;
}

export interface Item {
    id: string;
    title: string;
    quantity: number;
    checked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ItemInput {
    title: string;
    quantity: number;
} 