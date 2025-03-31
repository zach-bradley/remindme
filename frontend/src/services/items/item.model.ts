export interface Item {
    id: String;
    title: String;
    description: String;
    listId: String;
    checked: Boolean;
    dueDate: String;
    createdAt: String;
    updatedAt: String;
}

export interface ItemInput {
    name: String;
    quantity: String;
    listId: String;
} 