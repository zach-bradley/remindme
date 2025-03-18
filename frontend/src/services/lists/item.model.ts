export interface Item {
    id: string;
    title: string;
    description: string;
    listId: string;
    checked: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ItemInput {
    title: string;
    description: string;
    listId: string;
    dueDate: string;
} 