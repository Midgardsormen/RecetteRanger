import { authStore } from '../stores/auth.store';

// En production, utiliser l'URL actuelle, en dev utiliser localhost:3000
const API_BASE_URL = typeof window !== 'undefined' && window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : '';

// Store pour le token CSRF
let csrfToken: string | null = null;

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
  private getHeaders(skipCsrf = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Ajouter le token CSRF si disponible pour les requêtes mutantes
    // Skip pour login/register car ces routes sont exemptées de CSRF
    if (csrfToken && !skipCsrf) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    return headers;
  }

  // Récupérer le token CSRF depuis le serveur
  async fetchCsrfToken(): Promise<void> {
    try {
      // L'endpoint est /auth/csrf-token (pas /api/auth/csrf-token)
      const response = await fetch('/auth/csrf-token', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        csrfToken = data.csrfToken;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token CSRF:', error);
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(true), // Skip CSRF pour login
      credentials: 'include', // Permet l'envoi et la réception de cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la connexion');
    }

    const result = await response.json();

    // Rafraîchir le token CSRF après login car l'identifiant de session a changé
    // (de "anonymous-session" vers le JWT token)
    await this.fetchCsrfToken();

    return result;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(true), // Skip CSRF pour register
      credentials: 'include', // Permet l'envoi et la réception de cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création du compte');
    }

    const result = await response.json();

    // Rafraîchir le token CSRF après register car l'identifiant de session a changé
    // (de "anonymous-session" vers le JWT token)
    await this.fetchCsrfToken();

    return result;
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

  // ===== Recipes API =====

  async createRecipe(data: any) {
    return this.authenticatedFetch('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRecipe(id: string) {
    return this.authenticatedFetch(`/api/recipes/${id}`, {
      method: 'GET',
    });
  }

  async updateRecipe(id: string, data: any) {
    return this.authenticatedFetch(`/api/recipes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRecipe(id: string) {
    return this.authenticatedFetch(`/api/recipes/${id}`, {
      method: 'DELETE',
    });
  }

  async searchRecipes(searchParams: any) {
    return this.authenticatedFetch('/api/recipes/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  }

  // ==================== Meal Planning ====================

  // MealPlanDay
  async createMealPlanDay(data: any) {
    return this.authenticatedFetch('/api/meal-plans/days', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMealPlanDays(params: { userId?: string; fromDate?: string; toDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);

    return this.authenticatedFetch(`/api/meal-plans/days?${queryParams.toString()}`);
  }

  async getMealPlanDay(id: string) {
    return this.authenticatedFetch(`/api/meal-plans/days/${id}`);
  }

  async updateMealPlanDay(id: string, data: any) {
    return this.authenticatedFetch(`/api/meal-plans/days/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMealPlanDay(id: string) {
    return this.authenticatedFetch(`/api/meal-plans/days/${id}`, {
      method: 'DELETE',
    });
  }

  // MealPlanItem
  async createMealPlanItem(dayId: string, data: any) {
    return this.authenticatedFetch(`/api/meal-plans/days/${dayId}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMealPlanItem(id: string, data: any) {
    return this.authenticatedFetch(`/api/meal-plans/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMealPlanItem(id: string) {
    return this.authenticatedFetch(`/api/meal-plans/items/${id}`, {
      method: 'DELETE',
    });
  }

  // MealSlotConfig
  async createMealSlotConfig(userId: string, data: any) {
    return this.authenticatedFetch(`/api/meal-plans/slot-configs?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMealSlotConfigs(userId: string) {
    return this.authenticatedFetch(`/api/meal-plans/slot-configs?userId=${userId}`);
  }

  async getMealSlotConfig(id: string) {
    return this.authenticatedFetch(`/api/meal-plans/slot-configs/${id}`);
  }

  async updateMealSlotConfig(id: string, data: any) {
    return this.authenticatedFetch(`/api/meal-plans/slot-configs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMealSlotConfig(id: string) {
    return this.authenticatedFetch(`/api/meal-plans/slot-configs/${id}`, {
      method: 'DELETE',
    });
  }

  async initializeDefaultMealSlotConfigs(userId: string) {
    return this.authenticatedFetch(`/api/meal-plans/slot-configs/initialize?userId=${userId}`, {
      method: 'POST',
    });
  }

  // ==================== Shopping Lists ====================

  // ShoppingList
  async createShoppingList(data: any) {
    return this.authenticatedFetch('/api/shopping-lists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateShoppingList(data: any) {
    return this.authenticatedFetch('/api/shopping-lists/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getShoppingLists(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.authenticatedFetch(`/api/shopping-lists${query}`);
  }

  async getShoppingList(id: string) {
    return this.authenticatedFetch(`/api/shopping-lists/${id}`);
  }

  async updateShoppingList(id: string, data: any) {
    return this.authenticatedFetch(`/api/shopping-lists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteShoppingList(id: string) {
    return this.authenticatedFetch(`/api/shopping-lists/${id}`, {
      method: 'DELETE',
    });
  }

  // ShoppingListItem
  async createShoppingListItem(listId: string, data: any) {
    return this.authenticatedFetch(`/api/shopping-lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateShoppingListItem(id: string, data: any) {
    return this.authenticatedFetch(`/api/shopping-lists/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteShoppingListItem(id: string) {
    return this.authenticatedFetch(`/api/shopping-lists/items/${id}`, {
      method: 'DELETE',
    });
  }

  // User profile methods
  async updateUser(userId: string, data: any) {
    return this.authenticatedFetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    return this.authenticatedFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== Stores ====================

  async searchStores(searchParams: any) {
    const query = new URLSearchParams();
    if (searchParams.search) query.append('search', searchParams.search);
    if (searchParams.limit) query.append('limit', searchParams.limit.toString());
    if (searchParams.page) query.append('page', searchParams.page.toString());

    return this.authenticatedFetch(`/api/stores?${query.toString()}`);
  }

  async checkStoreDuplicates(name: string) {
    return this.authenticatedFetch(`/api/stores/check-duplicates?name=${encodeURIComponent(name)}`);
  }

  async createStore(data: any) {
    return this.authenticatedFetch('/api/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStore(id: string, data: any) {
    return this.authenticatedFetch(`/api/stores/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteStore(id: string) {
    return this.authenticatedFetch(`/api/stores/${id}`, {
      method: 'DELETE',
    });
  }

  async getStore(id: string) {
    return this.authenticatedFetch(`/api/stores/${id}`);
  }

  // ===== Upload API =====

  /**
   * Upload FormData avec protection CSRF
   * À utiliser pour tous les uploads de fichiers
   */
  async uploadFormData(url: string, formData: FormData): Promise<any> {
    // S'assurer que le token CSRF est disponible
    if (!csrfToken) {
      await this.fetchCsrfToken();
    }

    const headers: HeadersInit = {};
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    // NE PAS mettre Content-Type : le browser ajoutera le boundary automatiquement

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
    });

    if (response.status === 401) {
      authStore.logout();
      throw new Error('Session expirée, veuillez vous reconnecter');
    }

    if (response.status === 403) {
      // Potentiellement token CSRF invalide, réessayer une fois
      await this.fetchCsrfToken();
      throw new Error('Token CSRF invalide. Veuillez réessayer.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors de l\'upload');
    }

    return response.json();
  }
}

export const apiService = new ApiService();

// Initialiser le token CSRF au démarrage de l'application
// Ceci doit être appelé avant toute requête mutante
if (typeof window !== 'undefined') {
  apiService.fetchCsrfToken();
}
