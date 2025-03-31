import { List, ListInput, Item, ItemInput } from './list.model';
import { mutationBase } from '../../graphql/mutation';
import { queryBase } from '../../graphql/query';
import { authApi } from '../auth/auth.api';

export class ListApi {
    private baseUrl = "/graphql";

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        return response.json();
    }

    getHeaders() {
        return authApi.getHeaders();
    }

    async getLists(userId: String): Promise<List[]> {
        const listsQuery = queryBase(
            "lists",
            "lists",
            ["id", "name", "store", "userId", "items { id name quantity checked }"],
            { userId: { type: "UUID!", value: userId } }
        );

        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: listsQuery,
                variables: { userId }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.lists;
    }

    async createList(listData: ListInput): Promise<List> {
        const createListMutation = mutationBase(
            "createList",
            ["id", "name", "store", "userId", "items { id name quantity checked }"],
            { listData: "ListInput!"},
            "createList"
        );
        console.log(createListMutation)
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: createListMutation,
                variables: { listData }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.createList;
    }

    async updateList(listId: string, listData: Partial<ListInput>): Promise<List> {
        const updateListMutation = mutationBase(
            "updateList",
            ["id", "name", "store", "userId", "items { id name quantity checked }"],
            { 
                listId: { type: "ID!", value: listId },
                listData: { type: "ListInput!", value: listData }
            },
            "updateList"
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: updateListMutation,
                variables: { listId, listData }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.updateList;
    }

    async deleteList(listId: string): Promise<boolean> {
        const deleteListMutation = mutationBase(
            "deleteList",
            ["success"],
            { listId: { type: "ID!", value: listId } },
            "deleteList"
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: deleteListMutation,
                variables: { listId }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.deleteList.success;
    }

    async addItem(itemData: ItemInput): Promise<Item> {
        const addItemMutation = mutationBase(
            "addItem",
            ["id", "name", "quantity", "checked"],
            { itemData: { type: "ItemInput!", value: itemData } },
            "addItem"
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: addItemMutation,
                variables: { itemData }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.addItem;
    }

    async updateItem(itemId: string, itemData: Partial<ItemInput>): Promise<Item> {
        const updateItemMutation = mutationBase(
            "updateItem",
            ["id", "name", "quantity", "checked"],
            { 
                itemId: { type: "ID!", value: itemId },
                itemData: { type: "ItemInput!", value: itemData }
            },
            "updateItem"
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: updateItemMutation,
                variables: { itemId, itemData }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.updateItem;
    }

    async deleteItem(itemId: string): Promise<boolean> {
        const deleteItemMutation = mutationBase(
            "deleteItem",
            ["success"],
            { itemId: { type: "ID!", value: itemId } },
            "deleteItem"
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: deleteItemMutation,
                variables: { itemId }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.deleteItem.success;
    }

    async toggleItemChecked(itemId: string): Promise<Item> {
        const toggleItemMutation = mutationBase(
            "toggleItemChecked",
            ["id", "name", "quantity", "checked"],
            { itemId: { type: "ID!", value: itemId } },
            "toggleItemChecked"
        );
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                query: toggleItemMutation,
                variables: { itemId }
            })
        });
        const data = await this.handleResponse(response);
        return data.data.toggleItemChecked;
    }
}

export const listApi = new ListApi(); 