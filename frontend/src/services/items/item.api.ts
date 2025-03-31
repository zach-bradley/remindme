import { mutationBase } from '../../graphql/mutation';
import { queryBase } from '../../graphql/query';
import { Item, ItemInput } from './item.model';

export class ItemApi {
    private baseUrl = "/graphql";
    private token: string | null = null;

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        return response.json();
    }

    setToken(token: string) {
        this.token = token;
    }

    getHeaders() {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async createItem(request: ItemInput): Promise<Item> {
        const createItemMutation = mutationBase(
            "createItem",
            ["id", "name", "quantity", "listId"],
            { item_data: "ItemInput!" },
            "createItem"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: createItemMutation,
                variables: { item_data: request }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.createItem;
    }

    async updateItem(id: String, request: ItemInput): Promise<Item> {
        const updateItemMutation = mutationBase(
            "updateItem",
            ["id", "title", "description", "listId", "checked", "dueDate", "createdAt", "updatedAt"],
            { id: "String!", item_data: "ItemInput!" },
            "updateItem"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: updateItemMutation,
                variables: { id, item_data: request }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.updateItem;
    }

    async deleteItem(id: String): Promise<boolean> {
        const deleteItemMutation = mutationBase(
            "deleteItem",
            ["id"],
            { id: "String!" },
            "deleteItem"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: deleteItemMutation,
                variables: { id }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.deleteItem;
    }

    async toggleChecked(id: String): Promise<Item> {
        const toggleCheckedMutation = mutationBase(
            "toggleChecked",
            ["id", "title", "description", "listId", "checked", "dueDate", "createdAt", "updatedAt"],
            { id: "String!" },
            "toggleChecked"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: toggleCheckedMutation,
                variables: { id }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.toggleChecked;
    }

    async getItem(id: String): Promise<Item> {
        const getItemQuery = queryBase(
            "getItem",
            "item",
            ["id", "title", "description", "listId", "checked", "dueDate", "createdAt", "updatedAt"],
            { id: {type:"String!",value:id} }
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: getItemQuery,
                variables: { id }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.item;
    }
} 