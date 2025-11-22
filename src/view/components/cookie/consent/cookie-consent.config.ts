/**
 * Cookie Consent Configuration
 *
 * Centralizes all texts, labels, and configuration for the cookie consent banner
 */

export interface CookieCategoryConfig {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export const COOKIE_CONSENT_CONFIG = {
  title: 'Respect de votre vie privée',

  description: {
    main: 'Nous utilisons des cookies pour améliorer votre expérience sur RecetteRanger. Certains cookies sont **nécessaires** au fonctionnement du site (authentification, sécurité), tandis que d\'autres sont **optionnels** et nous aident à améliorer nos services.',

    additional: 'En cliquant sur "Tout accepter", vous acceptez l\'utilisation de tous les cookies. Vous pouvez personnaliser vos choix ou tout refuser.',

    privacyPolicyLink: '/privacy-policy',
    privacyPolicyText: 'Consultez notre politique de confidentialité pour plus d\'informations.',
  },

  categories: [
    {
      id: 'necessary',
      title: 'Cookies nécessaires',
      description: '(Toujours activés)',
      required: true,
    },
    {
      id: 'optional',
      title: 'Cookies optionnels',
      description: '(Fonctionnels, analytiques, marketing)',
      required: false,
    },
  ] as CookieCategoryConfig[],

  buttons: {
    acceptAll: 'Tout accepter',
    rejectAll: 'Refuser tout',
    customize: 'Personnaliser',
  },
} as const;
