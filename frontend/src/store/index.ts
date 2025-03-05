
import { createStore } from 'vuex';
import { User } from '../services/auth/auth.model';

export interface RootState {
    isAuthenticated: boolean;
    user: User | null;
}

export default createStore<RootState>({
    state: {
        isAuthenticated: false,
        user: null
    },
    mutations: {
        setAuth(state, value: boolean) {
            state.isAuthenticated = value;
        },
        setUser(state, user: User | null) {
            state.user = user;
        }
    },
    actions: {
        logout({ commit }) {
            commit('setAuth', false);
            commit('setUser', null);
        }
    }
});
