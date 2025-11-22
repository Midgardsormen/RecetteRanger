export interface CookieDetail {
  name: string;
  description: string;
}

export interface CookieCategoryPreference {
  id: 'necessary' | 'functional' | 'analytics' | 'marketing';
  name: string;
  description: string;
  required: boolean;
  cookies: CookieDetail[];
  note?: string;
}

export const COOKIE_PREFERENCES_CONFIG = {
  title: 'Gérer mes préférences de cookies',
  intro:
    'Nous utilisons différents types de cookies pour améliorer votre expérience. Vous pouvez choisir les catégories que vous souhaitez autoriser. Les cookies nécessaires sont toujours activés car ils sont essentiels au fonctionnement du site.',

  categories: [
    {
      id: 'necessary' as const,
      name: 'Cookies nécessaires',
      description:
        "Ces cookies sont indispensables au bon fonctionnement du site. Ils permettent d'utiliser les fonctionnalités principales comme la connexion, la navigation sécurisée et la protection contre les attaques.",
      required: true,
      cookies: [
        {
          name: 'auth_token',
          description: "Cookie d'authentification (expire après 7 jours)",
        },
        {
          name: 'session',
          description: 'Cookie de session pour maintenir votre connexion',
        },
        {
          name: 'csrf_token',
          description: 'Protection contre les attaques CSRF',
        },
      ],
    },
    {
      id: 'functional' as const,
      name: 'Cookies fonctionnels',
      description:
        "Ces cookies permettent de mémoriser vos préférences (langue, thème, etc.) et d'améliorer votre confort d'utilisation du site.",
      required: false,
      cookies: [
        {
          name: 'user_preferences',
          description: "Vos préférences d'affichage et de navigation",
        },
        {
          name: 'language',
          description: 'Langue préférée (si applicable)',
        },
        {
          name: 'theme',
          description: 'Thème clair/sombre (si applicable)',
        },
      ],
    },
    {
      id: 'analytics' as const,
      name: 'Cookies analytiques',
      description:
        "Ces cookies nous aident à comprendre comment vous utilisez le site afin d'améliorer votre expérience. Les données sont anonymisées.",
      required: false,
      cookies: [
        {
          name: '_ga',
          description: 'Google Analytics - Identifiant unique',
        },
        {
          name: '_gid',
          description: 'Google Analytics - Identifiant de session',
        },
        {
          name: '_gat',
          description: 'Google Analytics - Limitation du taux de requêtes',
        },
      ],
      note: "Actuellement, aucun service d'analytics n'est configuré. Cette catégorie est préparée pour une future intégration.",
    },
    {
      id: 'marketing' as const,
      name: 'Cookies marketing',
      description:
        "Ces cookies sont utilisés pour afficher des publicités personnalisées et mesurer l'efficacité de nos campagnes publicitaires.",
      required: false,
      cookies: [
        {
          name: '_fbp',
          description: 'Facebook Pixel',
        },
        {
          name: '_gcl_au',
          description: 'Google AdSense',
        },
      ],
      note: "Actuellement, aucun service de marketing n'est configuré. Cette catégorie est préparée pour une future intégration.",
    },
  ] as CookieCategoryPreference[],

  gdpr: {
    title: 'Vos droits RGPD',
    intro:
      'Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :',
    rights: [
      {
        name: "Droit d'accès",
        description: 'Consulter les données que nous détenons sur vous',
      },
      {
        name: 'Droit de rectification',
        description: 'Corriger vos données personnelles',
      },
      {
        name: "Droit à l'effacement",
        description: 'Supprimer vos données ("droit à l\'oubli")',
      },
      {
        name: "Droit d'opposition",
        description: 'Refuser le traitement de vos données',
      },
      {
        name: 'Droit à la portabilité',
        description: 'Récupérer vos données dans un format structuré',
      },
      {
        name: 'Droit de retrait du consentement',
        description: 'Retirer votre consentement à tout moment',
      },
    ],
    footer: 'Pour exercer ces droits, consultez notre',
    privacyPolicyLink: '/privacy-policy',
    privacyPolicyText: 'politique de confidentialité',
    footerEnd: 'ou contactez-nous.',
  },

  buttons: {
    rejectAll: 'Tout refuser',
    acceptAll: 'Tout accepter',
    savePreferences: 'Enregistrer mes choix',
  },

  badges: {
    required: 'Toujours activés',
  },

  detailsLabel: 'Voir les détails',
} as const;
