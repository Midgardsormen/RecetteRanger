import { writable } from 'svelte/store';

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export interface CookieConsent {
  necessary: boolean; // Toujours true, non modifiable
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean; // L'utilisateur a-t-il déjà fait un choix ?
  consent: CookieConsent;
  consentDate: Date | null;
  showBanner: boolean;
  showPreferences: boolean;
}

const STORAGE_KEY = 'recette-ranger-cookie-consent';
const CONSENT_EXPIRY_DAYS = 365; // Durée de validité du consentement (RGPD recommande 13 mois max)

// Consentement par défaut conforme RGPD : seuls les cookies nécessaires sont activés
const defaultConsent: CookieConsent = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

// Charger le consentement depuis le localStorage
function loadConsent(): CookieConsentState {
  if (typeof window === 'undefined') {
    return {
      hasConsented: false,
      consent: defaultConsent,
      consentDate: null,
      showBanner: false,
      showPreferences: false,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const consentDate = data.consentDate ? new Date(data.consentDate) : null;

      // Vérifier si le consentement a expiré
      if (consentDate) {
        const expiryDate = new Date(consentDate);
        expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);

        if (new Date() > expiryDate) {
          // Consentement expiré, réinitialiser
          localStorage.removeItem(STORAGE_KEY);
          return {
            hasConsented: false,
            consent: defaultConsent,
            consentDate: null,
            showBanner: true,
            showPreferences: false,
          };
        }
      }

      return {
        hasConsented: data.hasConsented || false,
        consent: {
          necessary: true, // Toujours true
          functional: data.consent?.functional || false,
          analytics: data.consent?.analytics || false,
          marketing: data.consent?.marketing || false,
        },
        consentDate,
        showBanner: !data.hasConsented,
        showPreferences: false,
      };
    }
  } catch (error) {
    console.error('Erreur lors du chargement des préférences cookies:', error);
  }

  // Première visite : afficher la bannière
  return {
    hasConsented: false,
    consent: defaultConsent,
    consentDate: null,
    showBanner: true,
    showPreferences: false,
  };
}

// Sauvegarder le consentement dans le localStorage
function saveConsent(state: CookieConsentState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      hasConsented: state.hasConsented,
      consent: state.consent,
      consentDate: state.consentDate,
    }));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences cookies:', error);
  }
}

function createCookieConsentStore() {
  const initialState = loadConsent();
  const { subscribe, set, update } = writable<CookieConsentState>(initialState);

  return {
    subscribe,

    // Accepter tous les cookies
    acceptAll: () => {
      const newState: CookieConsentState = {
        hasConsented: true,
        consent: {
          necessary: true,
          functional: true,
          analytics: true,
          marketing: true,
        },
        consentDate: new Date(),
        showBanner: false,
        showPreferences: false,
      };
      set(newState);
      saveConsent(newState);
    },

    // Refuser tous les cookies optionnels (garder uniquement les nécessaires)
    rejectAll: () => {
      const newState: CookieConsentState = {
        hasConsented: true,
        consent: defaultConsent,
        consentDate: new Date(),
        showBanner: false,
        showPreferences: false,
      };
      set(newState);
      saveConsent(newState);

      // Supprimer les cookies non-nécessaires
      deleteNonEssentialCookies();
    },

    // Sauvegarder les préférences personnalisées
    savePreferences: (consent: CookieConsent) => {
      const newState: CookieConsentState = {
        hasConsented: true,
        consent: {
          necessary: true, // Toujours true
          functional: consent.functional,
          analytics: consent.analytics,
          marketing: consent.marketing,
        },
        consentDate: new Date(),
        showBanner: false,
        showPreferences: false,
      };
      set(newState);
      saveConsent(newState);

      // Supprimer les cookies des catégories refusées
      if (!consent.functional) deleteCookiesByCategory('functional');
      if (!consent.analytics) deleteCookiesByCategory('analytics');
      if (!consent.marketing) deleteCookiesByCategory('marketing');
    },

    // Afficher/masquer la bannière
    setBannerVisibility: (show: boolean) => {
      update(state => ({ ...state, showBanner: show }));
    },

    // Afficher/masquer les préférences
    setPreferencesVisibility: (show: boolean) => {
      update(state => ({ ...state, showPreferences: show }));
    },

    // Réinitialiser le consentement (pour tester ou en cas de nouvelle réglementation)
    reset: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      const resetState = {
        hasConsented: false,
        consent: defaultConsent,
        consentDate: null,
        showBanner: true,
        showPreferences: false,
      };
      set(resetState);
      deleteNonEssentialCookies();
    },

    // Retirer le consentement (droit de retrait RGPD)
    withdrawConsent: () => {
      const newState: CookieConsentState = {
        hasConsented: true,
        consent: defaultConsent,
        consentDate: new Date(),
        showBanner: false,
        showPreferences: false,
      };
      set(newState);
      saveConsent(newState);
      deleteNonEssentialCookies();
    },
  };
}

// Utilitaire pour supprimer les cookies non-essentiels
function deleteNonEssentialCookies(): void {
  if (typeof window === 'undefined') return;

  // Liste des cookies à ne PAS supprimer (cookies nécessaires)
  const essentialCookies = ['auth_token', 'session'];

  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();

    // Ne pas supprimer les cookies essentiels
    if (!essentialCookies.includes(cookieName) && cookieName !== STORAGE_KEY) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    }
  });
}

// Supprimer les cookies d'une catégorie spécifique
function deleteCookiesByCategory(category: CookieCategory): void {
  if (typeof window === 'undefined') return;

  // Mapper les cookies à leurs catégories
  const cookieCategories: Record<string, CookieCategory> = {
    // Fonctionnels
    'user_preferences': 'functional',
    'language': 'functional',
    'theme': 'functional',

    // Analytics
    '_ga': 'analytics',
    '_gid': 'analytics',
    '_gat': 'analytics',

    // Marketing
    '_fbp': 'marketing',
    '_gcl_au': 'marketing',
  };

  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();

    if (cookieCategories[cookieName] === category) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    }
  });
}

export const cookieConsentStore = createCookieConsentStore();

// Helper pour vérifier si une catégorie de cookies est autorisée
export function isCookieCategoryAllowed(category: CookieCategory): boolean {
  let allowed = false;
  cookieConsentStore.subscribe(state => {
    allowed = state.consent[category];
  })();
  return allowed;
}
