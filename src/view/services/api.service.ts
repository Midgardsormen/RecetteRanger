import { authStore } from '../stores/auth.store';

const API_BASE_URL = 'http://localhost:3000';

interface LoginData {
  identifier: string;
  password: string;
}

interface RegisterData {
  pseudo: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

interface AuthResponse {
  user: {
    id: string;
    pseudo: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

class ApiService {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include', // Permet l'envoi et la réception de cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la connexion');
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include', // Permet l'envoi et la réception de cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création du compte');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la déconnexion');
    }
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include', // Envoie le cookie avec la requête
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    return response.json();
  }

  async checkAuth() {
    try {
      const user = await this.getProfile();
      return user;
    } catch (error) {
      // Utilisateur non authentifié
      return null;
    }
  }

  // Méthode générique pour les requêtes authentifiées
  async authenticatedFetch(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include', // Envoie le cookie avec la requête
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expiré, déconnecter l'utilisateur
      authStore.logout();
      throw new Error('Session expirée, veuillez vous reconnecter');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Une erreur est survenue');
    }

    return response.json();
  }

  // ===== Ingredients API =====

  async searchIngredients(searchParams: any) {
    return this.authenticatedFetch('/api/ingredients/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  }

  async checkDuplicates(label: string) {
    return this.authenticatedFetch('/api/ingredients/check-duplicates', {
      method: 'POST',
      body: JSON.stringify({ label }),
    });
  }

  async createIngredient(data: any) {
    return this.authenticatedFetch('/api/ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIngredient(id: string, data: any) {
    return this.authenticatedFetch(`/api/ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteIngredient(id: string) {
    return this.authenticatedFetch(`/api/ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  async getIngredient(id: string) {
    return this.authenticatedFetch(`/api/ingredients/${id}`);
  }

  async getAllIngredients(aisle?: string) {
    const query = aisle ? `?aisle=${aisle}` : '';
    return this.authenticatedFetch(`/api/ingredients${query}`);
  }
}

export const apiService = new ApiService();
