import { writable } from 'svelte/store';

export interface User {
  id: string;
  pseudo: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  return {
    subscribe,

    // Le token est maintenant dans un cookie HTTP-only, on ne stocke que l'utilisateur
    login: (user: User) => {
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    updateUser: (user: User) => {
      update(state => ({
        ...state,
        user,
      }));
    },

    setLoading: (isLoading: boolean) => {
      update(state => ({
        ...state,
        isLoading,
      }));
    },

    // Initialiser l'état d'authentification depuis le cookie
    initialize: (user: User | null) => {
      set({
        user,
        isAuthenticated: user !== null,
        isLoading: false,
      });
    },
  };
}

export const authStore = createAuthStore();
