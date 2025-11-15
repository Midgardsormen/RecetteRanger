<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { cookieConsentStore } from '../../stores/cookie-consent.store';
  import Button from '../../components/ui/Button.svelte';

  // Recevoir les données du SSR
  let { user: ssrUser = null }: { user?: any } = $props();

  function openCookiePreferences() {
    cookieConsentStore.setPreferencesVisibility(true);
  }

  // Date de dernière mise à jour (automatique)
  const lastUpdated = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
</script>

<Layout title="Politique de Confidentialité" currentPage="/privacy-policy" user={ssrUser}>
<div class="privacy-policy">
  <div class="privacy-policy__header">
    <h1 class="privacy-policy__title">Politique de Confidentialité et Cookies</h1>
    <p class="privacy-policy__updated">Dernière mise à jour : {lastUpdated}</p>
  </div>

  <div class="privacy-policy__content">
    <!-- Introduction -->
    <section class="privacy-section">
      <h2>1. Introduction</h2>
      <p>
        Bienvenue sur <strong>RecetteRanger</strong>. Nous accordons une grande importance à la protection
        de votre vie privée et à la sécurité de vos données personnelles. Cette politique de confidentialité
        vous informe sur la manière dont nous collectons, utilisons, partageons et protégons vos informations
        personnelles conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong>.
      </p>
    </section>

    <!-- Responsable du traitement -->
    <section class="privacy-section">
      <h2>2. Responsable du Traitement des Données</h2>
      <p>
        Le responsable du traitement des données personnelles collectées sur RecetteRanger est :
      </p>
      <div class="privacy-info-box">
        <p><strong>RecetteRanger</strong></p>
        <p>Email de contact : contact@recetteranger.fr</p>
        <p>Vous pouvez nous contacter pour toute question relative à vos données personnelles.</p>
      </div>
    </section>

    <!-- Données collectées -->
    <section class="privacy-section">
      <h2>3. Données Personnelles Collectées</h2>
      <p>Nous collectons différents types de données selon votre utilisation du service :</p>

      <h3>3.1 Données d'inscription</h3>
      <ul>
        <li>Pseudo</li>
        <li>Prénom et nom</li>
        <li>Adresse email</li>
        <li>Mot de passe (chiffré et sécurisé)</li>
        <li>Photo de profil (optionnelle)</li>
      </ul>

      <h3>3.2 Données d'utilisation</h3>
      <ul>
        <li>Recettes créées et enregistrées</li>
        <li>Listes de courses</li>
        <li>Planifications de repas</li>
        <li>Ingrédients et articles favoris</li>
        <li>Préférences utilisateur</li>
      </ul>

      <h3>3.3 Données techniques</h3>
      <ul>
        <li>Adresse IP</li>
        <li>Type de navigateur et version</li>
        <li>Système d'exploitation</li>
        <li>Pages visitées et durée de visite</li>
        <li>Date et heure de connexion</li>
      </ul>
    </section>

    <!-- Finalités du traitement -->
    <section class="privacy-section">
      <h2>4. Finalités du Traitement</h2>
      <p>Vos données personnelles sont utilisées pour les finalités suivantes :</p>

      <h3>4.1 Fourniture du service</h3>
      <ul>
        <li>Création et gestion de votre compte utilisateur</li>
        <li>Accès aux fonctionnalités de l'application (recettes, listes de courses, plannings)</li>
        <li>Sauvegarde et synchronisation de vos données</li>
        <li>Communication relative au service (notifications, confirmations)</li>
      </ul>

      <h3>4.2 Amélioration du service</h3>
      <ul>
        <li>Analyse de l'utilisation pour améliorer l'expérience utilisateur</li>
        <li>Détection et correction de bugs</li>
        <li>Développement de nouvelles fonctionnalités</li>
      </ul>

      <h3>4.3 Sécurité</h3>
      <ul>
        <li>Protection contre les accès non autorisés</li>
        <li>Prévention de la fraude et des abus</li>
        <li>Respect de nos obligations légales</li>
      </ul>
    </section>

    <!-- Base légale -->
    <section class="privacy-section">
      <h2>5. Base Légale du Traitement</h2>
      <p>Le traitement de vos données personnelles repose sur :</p>
      <ul>
        <li><strong>Votre consentement :</strong> Pour les cookies non-nécessaires et les communications marketing</li>
        <li><strong>L'exécution du contrat :</strong> Pour la fourniture du service que vous avez demandé</li>
        <li><strong>L'intérêt légitime :</strong> Pour l'amélioration du service et la sécurité</li>
        <li><strong>Les obligations légales :</strong> Pour respecter nos obligations réglementaires</li>
      </ul>
    </section>

    <!-- Cookies -->
    <section class="privacy-section">
      <h2>6. Politique de Cookies</h2>
      <p>
        RecetteRanger utilise des cookies pour améliorer votre expérience.
        Un cookie est un petit fichier texte stocké sur votre appareil.
      </p>

      <h3>6.1 Types de cookies utilisés</h3>

      <div class="cookie-type">
        <h4>🔒 Cookies Nécessaires (Toujours activés)</h4>
        <p>
          Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.
        </p>
        <ul>
          <li><strong>auth_token</strong> : Authentification et maintien de session (7 jours)</li>
          <li><strong>session</strong> : Gestion de la session utilisateur</li>
          <li><strong>csrf_token</strong> : Protection contre les attaques CSRF</li>
        </ul>
      </div>

      <div class="cookie-type">
        <h4>⚙️ Cookies Fonctionnels (Optionnels)</h4>
        <p>
          Ces cookies permettent de mémoriser vos préférences et d'améliorer votre confort d'utilisation.
        </p>
        <ul>
          <li><strong>user_preferences</strong> : Préférences d'affichage et de navigation</li>
          <li><strong>language</strong> : Langue préférée</li>
          <li><strong>theme</strong> : Thème clair/sombre</li>
        </ul>
      </div>

      <div class="cookie-type">
        <h4>📊 Cookies Analytiques (Optionnels)</h4>
        <p>
          Ces cookies nous aident à comprendre comment vous utilisez le site pour l'améliorer.
          Les données sont anonymisées.
        </p>
        <ul>
          <li><strong>_ga, _gid, _gat</strong> : Google Analytics (si activé)</li>
        </ul>
        <p class="cookie-note">
          <strong>Note :</strong> Actuellement, aucun service d'analytics n'est configuré.
        </p>
      </div>

      <div class="cookie-type">
        <h4>📢 Cookies Marketing (Optionnels)</h4>
        <p>
          Ces cookies sont utilisés pour afficher des publicités personnalisées.
        </p>
        <ul>
          <li><strong>_fbp</strong> : Facebook Pixel (si activé)</li>
          <li><strong>_gcl_au</strong> : Google AdSense (si activé)</li>
        </ul>
        <p class="cookie-note">
          <strong>Note :</strong> Actuellement, aucun service de marketing n'est configuré.
        </p>
      </div>

      <h3>6.2 Gestion des cookies</h3>
      <p>
        Vous pouvez à tout moment modifier vos préférences de cookies en cliquant sur le bouton ci-dessous
        ou via le lien "Gérer les cookies" dans le footer du site.
      </p>
      <div class="privacy-action">
        <Button variant="primary" onclick={openCookiePreferences}>
          Gérer mes préférences de cookies
        </Button>
      </div>

      <h3>6.3 Durée de conservation des cookies</h3>
      <p>
        Votre consentement aux cookies est conservé pendant 12 mois. Passé ce délai,
        nous vous demanderons à nouveau votre consentement.
      </p>
    </section>

    <!-- Partage des données -->
    <section class="privacy-section">
      <h2>7. Partage des Données</h2>
      <p>
        Nous ne vendons jamais vos données personnelles. Vos données peuvent être partagées uniquement dans
        les cas suivants :
      </p>
      <ul>
        <li>
          <strong>Prestataires de services :</strong> Hébergement (serveurs sécurisés), stockage d'images (Cloudinary)
        </li>
        <li>
          <strong>Obligations légales :</strong> Sur demande des autorités compétentes dans le cadre légal
        </li>
        <li>
          <strong>Protection de nos droits :</strong> Pour prévenir la fraude ou protéger nos utilisateurs
        </li>
      </ul>
      <p>
        Tous nos prestataires sont conformes au RGPD et situés dans l'Union Européenne ou disposent
        de garanties appropriées.
      </p>
    </section>

    <!-- Vos droits RGPD -->
    <section class="privacy-section">
      <h2>8. Vos Droits RGPD</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>

      <div class="rights-grid">
        <div class="right-card">
          <h4>👁️ Droit d'accès</h4>
          <p>Obtenir une copie de vos données personnelles</p>
        </div>

        <div class="right-card">
          <h4>✏️ Droit de rectification</h4>
          <p>Corriger ou mettre à jour vos informations</p>
        </div>

        <div class="right-card">
          <h4>🗑️ Droit à l'effacement</h4>
          <p>Demander la suppression de vos données ("droit à l'oubli")</p>
        </div>

        <div class="right-card">
          <h4>🚫 Droit d'opposition</h4>
          <p>Vous opposer au traitement de vos données</p>
        </div>

        <div class="right-card">
          <h4>📦 Droit à la portabilité</h4>
          <p>Récupérer vos données dans un format structuré</p>
        </div>

        <div class="right-card">
          <h4>⏸️ Droit à la limitation</h4>
          <p>Limiter le traitement de vos données</p>
        </div>

        <div class="right-card">
          <h4>↩️ Droit de retrait du consentement</h4>
          <p>Retirer votre consentement à tout moment</p>
        </div>

        <div class="right-card">
          <h4>⚖️ Droit de réclamation</h4>
          <p>Déposer une plainte auprès de la CNIL</p>
        </div>
      </div>

      <h3>8.1 Comment exercer vos droits ?</h3>
      <p>
        Pour exercer l'un de ces droits, vous pouvez :
      </p>
      <ul>
        <li>Nous contacter par email à : <strong>privacy@recetteranger.fr</strong></li>
        <li>Accéder à votre profil pour modifier vos informations personnelles</li>
        <li>Supprimer votre compte depuis les paramètres de votre profil</li>
      </ul>
      <p>
        Nous nous engageons à répondre à votre demande dans un délai de <strong>1 mois maximum</strong>
        à compter de la réception de votre demande.
      </p>
    </section>

    <!-- Sécurité -->
    <section class="privacy-section">
      <h2>9. Sécurité des Données</h2>
      <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :</p>
      <ul>
        <li>🔐 <strong>Chiffrement :</strong> HTTPS pour toutes les communications, mots de passe chiffrés avec bcrypt</li>
        <li>🛡️ <strong>Protection contre les attaques :</strong> CSRF, XSS, injection SQL</li>
        <li>🔒 <strong>Cookies sécurisés :</strong> HTTP-only, Secure, SameSite</li>
        <li>🔑 <strong>Authentification :</strong> Tokens JWT sécurisés avec expiration</li>
        <li>📊 <strong>Logs sécurisés :</strong> Surveillance et détection des activités suspectes</li>
        <li>🔄 <strong>Sauvegardes régulières :</strong> Protection contre la perte de données</li>
      </ul>
    </section>

    <!-- Conservation des données -->
    <section class="privacy-section">
      <h2>10. Durée de Conservation</h2>
      <p>Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités poursuivies :</p>
      <ul>
        <li><strong>Données de compte :</strong> Tant que votre compte est actif + 3 mois après suppression</li>
        <li><strong>Données de contenu :</strong> Tant que votre compte est actif</li>
        <li><strong>Logs de connexion :</strong> 12 mois maximum</li>
        <li><strong>Cookies :</strong> Durée variable selon le type (voir section 6.3)</li>
      </ul>
    </section>

    <!-- Transferts internationaux -->
    <section class="privacy-section">
      <h2>11. Transferts Internationaux</h2>
      <p>
        Vos données sont principalement stockées et traitées au sein de l'Union Européenne.
        Si des transferts vers des pays tiers sont nécessaires, nous nous assurons que des garanties
        appropriées sont en place (clauses contractuelles types de la Commission Européenne).
      </p>
    </section>

    <!-- Mineurs -->
    <section class="privacy-section">
      <h2>12. Protection des Mineurs</h2>
      <p>
        RecetteRanger n'est pas destiné aux personnes de moins de 16 ans.
        Si vous avez moins de 16 ans, vous ne devez pas utiliser ce service ni fournir de données personnelles.
        Si nous découvrons qu'un mineur a créé un compte, nous le supprimerons immédiatement.
      </p>
    </section>

    <!-- Modifications -->
    <section class="privacy-section">
      <h2>13. Modifications de cette Politique</h2>
      <p>
        Nous pouvons modifier cette politique de confidentialité à tout moment.
        En cas de modification substantielle, nous vous en informerons par email ou via une notification
        sur le site. La date de dernière mise à jour est indiquée en haut de cette page.
      </p>
    </section>

    <!-- Contact -->
    <section class="privacy-section">
      <h2>14. Nous Contacter</h2>
      <p>Pour toute question concernant cette politique de confidentialité ou vos données personnelles :</p>
      <div class="contact-box">
        <p><strong>Email :</strong> privacy@recetteranger.fr</p>
        <p><strong>Objet :</strong> "Données personnelles - RGPD"</p>
      </div>
      <p>
        Vous pouvez également contacter la <strong>CNIL (Commission Nationale de l'Informatique et des Libertés)</strong>
        si vous estimez que vos droits ne sont pas respectés :
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
      </p>
    </section>
  </div>
</div>
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;

  .privacy-policy {
    max-width: 900px;
    margin: 0 auto;
    padding: $spacing-xl;
    margin-top: 40px; // Espace en desktop pour éviter le chevauchement avec le logo

    @media (max-width: $breakpoint-md) {
      padding: $spacing-md;
      margin-top: 80px; // Espace pour éviter le chevauchement avec le logo sur mobile
    }

    @media (max-width: $breakpoint-sm) {
      margin-top: 100px; // Plus d'espace sur très petit écran
    }

    &__header {
      text-align: center;
      margin-bottom: $spacing-xl;
      padding-bottom: $spacing-lg;
      border-bottom: 2px solid $brand-primary;
    }

    &__title {
      color: $brand-primary;
      font-size: $font-size-4xl;
      margin: 0 0 $spacing-sm 0;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-xl;
      }
    }

    &__updated {
      color: $color-gray-600;
      font-size: $font-size-sm;
      margin: 0;
    }

    &__content {
      line-height: 1.7;
    }
  }

  .privacy-section {
    margin-bottom: $spacing-xl;

    h2 {
      color: $brand-primary;
      font-size: $font-size-xl;
      margin: 0 0 $spacing-md 0;
      padding-top: $spacing-lg;
    }

    h3 {
      color: $color-gray-800;
      font-size: $font-size-lg;
      margin: $spacing-lg 0 $spacing-sm 0;
    }

    h4 {
      color: $color-gray-700;
      font-size: $font-size-base;
      margin: $spacing-md 0 $spacing-xs 0;
    }

    p {
      color: $color-gray-700;
      margin: 0 0 $spacing-md 0;
    }

    ul {
      color: $color-gray-700;
      margin: $spacing-sm 0 $spacing-md 0;
      padding-left: $spacing-xl;

      li {
        margin-bottom: $spacing-xs;
      }
    }

    strong {
      color: $color-gray-800;
      font-weight: $font-weight-semibold;
    }

    a {
      color: $brand-primary;
      text-decoration: underline;

      &:hover {
        color: $brand-quaternary;
      }
    }
  }

  .privacy-info-box,
  .contact-box {
    background: $color-gray-50;
    border-left: 4px solid $brand-primary;
    padding: $spacing-md;
    margin: $spacing-md 0;
    border-radius: $radius-sm;

    p {
      margin: $spacing-xs 0;
    }
  }

  .privacy-action {
    margin: $spacing-md 0;
  }

  .cookie-type {
    background: $color-gray-50;
    border-radius: $radius-md;
    padding: $spacing-md;
    margin: $spacing-md 0;

    h4 {
      margin-top: 0;
      color: $brand-primary;
    }

    p {
      margin: $spacing-xs 0 $spacing-sm 0;
    }

    ul {
      margin: $spacing-sm 0;
    }
  }

  .cookie-note {
    background: $color-warning-light;
    border-left: 3px solid $color-warning;
    padding: $spacing-xs $spacing-sm;
    margin-top: $spacing-sm;
    font-size: $font-size-sm;
    border-radius: $radius-sm;

    strong {
      color: $color-warning-dark;
    }
  }

  .rights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-md;
    margin: $spacing-lg 0;
  }

  .right-card {
    background: $color-white;
    border: 2px solid $color-gray-200;
    border-radius: $radius-md;
    padding: $spacing-md;
    transition: all 0.2s ease;

    &:hover {
      border-color: $brand-primary;
      box-shadow: 0 4px 12px $color-black-alpha-10;
      transform: translateY(-2px);
    }

    h4 {
      margin: 0 0 $spacing-xs 0;
      color: $brand-primary;
      font-size: $font-size-base;
    }

    p {
      margin: 0;
      font-size: $font-size-sm;
      color: $color-gray-600;
    }
  }
</style>
