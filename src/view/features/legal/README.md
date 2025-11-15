# Mentions Légales - Instructions

## 📋 Mise en place

1. **Remplissez vos informations**
   - Ouvrez `LegalNotice.svelte`
   - Recherchez tous les placeholders `[EN MAJUSCULES]`
   - Remplacez-les par vos vraies données

2. **Pourquoi versionner ces données ?**
   - Les mentions légales sont **obligatoirement publiques** selon la loi française
   - Elles doivent être affichées sur votre site
   - Votre nom/adresse/SIRET sont déjà dans les registres publics
   - Donc pas de risque à les mettre dans Git

## 🔍 Checklist des informations à remplir

### Obligatoire pour tous
- ✅ Date de mise à jour
- ✅ Nom complet ou raison sociale
- ✅ Statut juridique
- ✅ Adresse complète
- ✅ Email de contact
- ✅ Nom de l'hébergeur
- ✅ Adresse de l'hébergeur
- ✅ Ville du tribunal compétent

### Si vous êtes professionnel
- ⚠️ Numéro SIRET (14 chiffres)
- ⚠️ Numéro RCS (Registre du Commerce et des Sociétés)
- ⚠️ Capital social (pour SARL/SAS)
- ⚠️ Numéro de TVA intracommunautaire (si assujetti)

### Si vous êtes association
- ⚠️ Numéro RNA (Répertoire National des Associations)

### Optionnel
- 🔹 Téléphone (attention, sera public)
- 🔹 Médiateur de la consommation (obligatoire si vous vendez à des consommateurs)

## 📁 Structure des fichiers

```
legal/
├── README.md              ← Ce fichier
└── LegalNotice.svelte     ← Mentions légales à remplir
```

## 📚 Ressources légales

- [CNIL - Mentions légales](https://www.cnil.fr/fr/modeles/mention)
- [Service-Public - Mentions obligatoires](https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228)
- [Légifrance - Code de la consommation](https://www.legifrance.gouv.fr/)

## 🔗 Intégration dans l'application

Une fois `LegalNotice.svelte` rempli, ajoutez un lien dans le footer :

```svelte
<a href="/legal-notice" class="footer-link">Mentions légales</a>
```

Et créez la route correspondante dans votre application.
