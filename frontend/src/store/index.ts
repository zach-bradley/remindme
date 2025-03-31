import { defineStore } from 'pinia';
import { User } from '../services/users/user.model';
import { List, ListInput } from '../services/lists/list.model';
import { ListApi } from '../services/lists/list.api';
import { authApi } from '../services/auth/auth.api';
import { userApi } from '@/services/users/user.api';

const listApi = new ListApi();

export const useMainStore = defineStore('main', {
    state: () => ({
        isAuthenticated: false as Boolean,
        user: null as User | null,
        lists: [] as List[],
        isLoading: false as Boolean,
        error: null as string | null
    }),

    getters: {
        username: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : 'Guest'
    },

    actions: {
        async initializeAuth() {
            const token = authApi.getToken();
            if (token) {
                try {
                    const user = await userApi.getCurrentUser();
                    this.setUser(user);
                    this.setAuth(true);
                    await this.fetchLists();
                } catch (error) {
                    this.logout();
                }
            }
        },

        setAuth(value: boolean) {
            this.isAuthenticated = value;
        },

        setUser(user: User | null) {
            this.user = user;
        },

        setLists(lists: List[]) {
            this.lists = lists;
        },

        addList(list: List) {
            this.lists.push(list);
        },

        setLoading(value: boolean) {
            this.isLoading = value;
        },

        setError(error: string | null) {
            this.error = error;
        },

        async fetchLists() {
            if (!this.user?.id) return;
            
            this.setLoading(true);
            this.setError(null);
            
            try {
                const lists = await listApi.getLists(this.user.id.toString());
                this.setLists(lists);
            } catch (error) {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch lists');
            } finally {
                this.setLoading(false);
            }
        },
        
        async createList(listData: ListInput) {
            if (!this.user?.id) return;
            
            this.setLoading(true);
            this.setError(null);
            
            try {
                const newList = await listApi.createList(listData);
                this.addList(newList);
                return newList;
            } catch (error) {
                this.setError(error instanceof Error ? error.message : 'Failed to create list');
                throw error;
            } finally {
                this.setLoading(false);
            }
        },
        
        async logout() {
            await authApi.logout();
            this.setAuth(false);
            this.setUser(null);
            this.setLists([]);
            this.setError(null);
        }
    }
});
