import { mutationBase } from '../../graphql/mutation';
import { queryBase } from '../../graphql/query';
import { List, ListInput, Item, ItemInput } from './list.model';

export class ListApi {
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

    async getList(id: String): Promise<List> {
        const getListQuery = queryBase(
            "getList",
            "list",
            ["id", "name", "place", "userId", "items { id name quantity checked }"],
            { id: {type:"String!",value:id} }
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: getListQuery,
                variables: { id }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.list;
    }

    async getLists(id: string): Promise<List[]> {
        const getListsQuery = queryBase(
            "getLists",
            "lists",
            ["id", "name", "place", "userId", "items { id name quantity checked }"],
            { id: {type: "String!",  value: id}}
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: getListsQuery,
                variables: { id: id }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.lists;
    }

    async createList(request: ListInput): Promise<List> {
        const createListMutation = mutationBase(
            "createList",
            ["id", "name", "store", "userId", "items { id name quantity checked}"],
            { list_data: "ListInput!" },
            "createList"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: createListMutation,
                variables: { list_data: request }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.createList;
    }

    async updateList(id: string, request: ListInput): Promise<List> {
        const updateListMutation = mutationBase(
            "updateList",
            ["id", "name", "store", "userId", "items { id name quantity checked }"],
            { id: "UUID!", list_data: "ListInput!" },
            "updateList"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: updateListMutation,
                variables: { id, list_data: request }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.updateList;
    }

    async deleteList(id: string): Promise<boolean> {
        const deleteListMutation = mutationBase(
            "deleteList",
            ["id"],
            { id: "UUID!" },
            "deleteList"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: deleteListMutation,
                variables: { id }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.deleteList;
    }

    // Item operations
    async createItem(listId: string, request: ItemInput): Promise<Item> {
        const createItemMutation = mutationBase(
            "createItem",
            ["id", "name", "quantity", "checked"],
            { list_id: "UUID!", item_data: "ItemInput!" },
            "createItem"
        );

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: createItemMutation,
                variables: { list_id: listId, item_data: request }
            })
        });

        const data = await this.handleResponse(response);
        return data.data.createItem;
    }

    async updateItem(id: string, request: ItemInput): Promise<Item> {
        const updateItemMutation = mutationBase(
            "updateItem",
            ["id", "name", "quantity", "checked"],
            { id: "UUID!", item_data: "ItemInput!" },
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

    async deleteItem(id: string): Promise<boolean> {
        const deleteItemMutation = mutationBase(
            "deleteItem",
            ["id"],
            { id: "UUID!" },
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

    async toggleItemChecked(id: string): Promise<Item> {
        const toggleCheckedMutation = mutationBase(
            "toggleItemChecked",
            ["id", "name", "quantity", "checked"],
            { id: "UUID!" },
            "toggleItemChecked"
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
        return data.data.toggleItemChecked;
    }
} 