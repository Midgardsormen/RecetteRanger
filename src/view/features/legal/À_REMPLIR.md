# 📝 Informations à remplir dans LegalNotice.svelte

## ✅ Ce qui est déjà fait automatiquement :
- ✅ Date de mise à jour (automatique à chaque chargement de page)
- ✅ Statut juridique : Particulier
- ✅ Base de données : Neon (PostgreSQL)
- ✅ Stockage d'images : Cloudinary

## 🔴 À remplir manuellement (rechercher et remplacer) :

### Informations personnelles obligatoires :
1. **[VOTRE NOM COMPLET]** (apparaît 5 fois)
   - Votre nom et prénom
   - Exemple : "Jean Dupont"

2. **[VOTRE ADRESSE COMPLÈTE]** (apparaît 1 fois)
   - Votre adresse postale complète
   - Exemple : "123 Rue de la République, 75001 Paris, France"

3. **[VOTRE EMAIL DE CONTACT]** (apparaît 3 fois)
   - Votre email de contact
   - Exemple : "contact@recetteranger.fr"

### Informations sur l'hébergement (obligatoires) :
4. **[NOM DE L'HÉBERGEUR]**
   - Nom de votre hébergeur web
   - Exemple : "Vercel", "OVH", "AWS", etc.

5. **[ADRESSE DE L'HÉBERGEUR]**
   - Adresse complète de l'hébergeur
   - Pour Vercel : "440 N Barranca Ave #4133, Covina, CA 91723, USA"
   - Pour OVH : "2 rue Kellermann, 59100 Roubaix, France"

6. **[TÉLÉPHONE DE L'HÉBERGEUR]**
   - Numéro de téléphone de l'hébergeur
   - Chercher sur leur site web

7. **[URL]** et **[URL DE L'HÉBERGEUR]**
   - URL du site de l'hébergeur
   - Exemple : "https://vercel.com"

### Informations juridiques :
8. **[VILLE DU TRIBUNAL COMPÉTENT]**
   - Ville du tribunal de votre domicile
   - Exemple : "Paris", "Lyon", "Marseille", etc.

### Optionnel :
9. **[OPTIONNEL - votre numéro si vous souhaitez le publier]**
   - Votre téléphone si vous voulez le rendre public
   - Sinon, supprimez cette ligne

10. **Section Médiation (section 11)**
    - Si votre site est gratuit et non commercial : **SUPPRIMEZ toute la section 11**
    - Si vous proposez des services payants : remplissez les informations du médiateur

## 🔧 Comment remplir ?

### Option 1 : Rechercher et remplacer (recommandé)
1. Ouvrir `LegalNotice.svelte` dans VS Code
2. `Ctrl+H` (ou Cmd+H sur Mac)
3. Rechercher : `[VOTRE NOM COMPLET]`
4. Remplacer par : `Jean Dupont` (votre vrai nom)
5. "Remplacer tout"
6. Répéter pour chaque placeholder

### Option 2 : Remplir manuellement
- Chercher chaque `[TEXTE EN MAJUSCULES]`
- Remplacer par vos vraies données

## 📊 Vérification

Une fois rempli, vérifiez qu'il ne reste plus de `[` dans le fichier :
```bash
# Dans VS Code, rechercher : \[
# Il ne devrait y avoir aucun résultat
```

## ⚠️ Rappel important

- Ces informations sont **obligatoires par la loi** (Article 6-III-1 de la LCEN)
- Elles seront **publiques** sur votre site
- C'est normal et légal, elles sont déjà dans les registres publics
- Ne pas les fournir expose à une amende de 75 000 € (particulier)
