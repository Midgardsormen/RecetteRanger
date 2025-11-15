<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';

  // Recevoir les données du SSR
  let { user: ssrUser = null }: { user?: any } = $props();

  // Date de dernière mise à jour (automatique)
  const lastUpdated = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
</script>

<Layout title="Mentions Légales" currentPage="/legal-notice" user={ssrUser}>
<div class="legal-notice">
  <div class="legal-notice__header">
    <h1 class="legal-notice__title">Mentions Légales</h1>
    <p class="legal-notice__updated">Dernière mise à jour : {lastUpdated}</p>
  </div>

  <div class="legal-notice__content">
    <!-- Éditeur du site -->
    <section class="legal-section">
      <h2>1. Éditeur du Site</h2>
      <p>
        Le site <strong>RecetteRanger</strong> est édité par :
      </p>
      <div class="legal-info-box">
        <p><strong>Nom :</strong> Maxime Decourtray</p>
        <p><strong>Statut juridique :</strong> Particulier</p>
        <p><strong>Adresse :</strong> 116/1 rue des Francs, 59200 Tourcoing, France</p>
        <p><strong>Email :</strong> mdecourtray11@gmail.com</p>
      </div>
      <p class="legal-note">
        <em>Note : En tant que particulier, vous n'avez pas de SIRET. Ces mentions sont suffisantes.</em>
      </p>
    </section>

    <!-- Directeur de publication -->
    <section class="legal-section">
      <h2>2. Directeur de Publication</h2>
      <p>
        Le directeur de la publication du site est : <strong>Maxime Decourtray</strong>
      </p>
    </section>

    <!-- Hébergement -->
    <section class="legal-section">
      <h2>3. Hébergement</h2>
      <p>
        Le site <strong>RecetteRanger</strong> est hébergé par :
      </p>
      <div class="legal-info-box">
        <p><strong>Hébergeur :</strong> Render Services, Inc.</p>
        <p><strong>Adresse :</strong> 525 Brannan St, Suite 300, San Francisco, CA 94107, USA</p>
        <p><strong>Site web :</strong> <a href="https://render.com" target="_blank" rel="noopener noreferrer">render.com</a></p>
      </div>
      <p class="legal-note">
        <em>Note : Si vous changez d'hébergeur, pensez à mettre à jour ces informations.</em>
      </p>

      <h3>Services tiers utilisés</h3>
      <ul>
        <li><strong>Stockage d'images :</strong> Cloudinary - <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer">cloudinary.com</a></li>
        <li><strong>Base de données :</strong> Neon (PostgreSQL) - <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">neon.tech</a></li>
      </ul>
    </section>

    <!-- Propriété intellectuelle -->
    <section class="legal-section">
      <h2>4. Propriété Intellectuelle</h2>
      <p>
        L'ensemble du contenu présent sur le site RecetteRanger (textes, images, graphismes, logo, icônes, sons, logiciels, etc.)
        est la propriété exclusive de <strong>Maxime Decourtray</strong>, sauf mentions particulières.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site,
        quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de
        <strong>Maxime Decourtray</strong>.
      </p>
      <p>
        Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée
        comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants
        du Code de Propriété Intellectuelle.
      </p>

      <h3>Contenus utilisateurs</h3>
      <p>
        Les recettes, listes de courses et autres contenus créés par les utilisateurs restent la propriété de leurs auteurs.
        En publiant du contenu sur RecetteRanger, vous accordez à <strong>Maxime Decourtray</strong> une licence
        non-exclusive pour l'utilisation, la reproduction et l'affichage de ce contenu dans le cadre du service.
      </p>
    </section>

    <!-- Données personnelles -->
    <section class="legal-section">
      <h2>5. Données Personnelles</h2>
      <p>
        Pour toute information concernant la collecte et le traitement de vos données personnelles,
        veuillez consulter notre <a href="/privacy-policy" class="legal-link">Politique de Confidentialité</a>.
      </p>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
        vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles.
      </p>
      <p>
        <strong>Responsable du traitement des données :</strong> Maxime Decourtray
      </p>
      <p>
        Pour exercer vos droits, contactez-nous à : <strong>mdecourtray11@gmail.com</strong>
      </p>
    </section>

    <!-- Cookies -->
    <section class="legal-section">
      <h2>6. Cookies</h2>
      <p>
        Le site RecetteRanger utilise des cookies pour améliorer votre expérience utilisateur et assurer le bon
        fonctionnement du service.
      </p>
      <p>
        Pour plus d'informations sur l'utilisation des cookies et la gestion de vos préférences, consultez notre
        <a href="/privacy-policy" class="legal-link">Politique de Cookies</a> ou
        <button class="legal-link legal-link--button" onclick={() => {
          if (typeof window !== 'undefined' && window.cookieConsentStore) {
            window.cookieConsentStore.setPreferencesVisibility(true);
          }
        }}>gérez vos préférences</button>.
      </p>
    </section>

    <!-- Limitation de responsabilité -->
    <section class="legal-section">
      <h2>7. Limitation de Responsabilité</h2>

      <h3>7.1 Contenu du site</h3>
      <p>
        RecetteRanger s'efforce d'assurer l'exactitude et la mise à jour des informations
        diffusées sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité
        des informations mises à disposition sur ce site.
      </p>

      <h3>7.2 Recettes et conseils culinaires</h3>
      <div class="legal-warning-box">
        <p>
          <strong>⚠️ Important :</strong> Les recettes et conseils culinaires présents sur ce site sont fournis
          à titre informatif uniquement.
        </p>
        <ul>
          <li>RecetteRanger ne peut être tenu responsable en cas d'allergie, d'intolérance ou d'intoxication alimentaire</li>
          <li>Il est de votre responsabilité de vérifier les ingrédients et leur compatibilité avec votre régime alimentaire</li>
          <li>En cas de régime spécifique ou de problème de santé, consultez un professionnel de santé</li>
          <li>Respectez les règles d'hygiène et de conservation des aliments</li>
        </ul>
      </div>

      <h3>7.3 Disponibilité du service</h3>
      <p>
        RecetteRanger s'efforce d'assurer la disponibilité et l'accessibilité du site 24h/24 et 7j/7.
        Toutefois, nous ne pouvons garantir une disponibilité continue et nous déclinons toute responsabilité en cas
        d'interruption du service, notamment pour des raisons de maintenance, de mise à jour ou de causes indépendantes
        de notre volonté.
      </p>

      <h3>7.4 Liens externes</h3>
      <p>
        Le site RecetteRanger peut contenir des liens hypertextes vers d'autres sites. Nous ne pouvons être tenus
        responsables du contenu de ces sites externes, ni de leur politique de confidentialité.
      </p>
    </section>

    <!-- Conditions d'utilisation -->
    <section class="legal-section">
      <h2>8. Conditions d'Utilisation</h2>

      <h3>8.1 Accès au service</h3>
      <p>
        L'accès au site RecetteRanger est gratuit. Certaines fonctionnalités nécessitent la création d'un compte utilisateur.
      </p>

      <h3>8.2 Obligations de l'utilisateur</h3>
      <p>En utilisant ce site, vous vous engagez à :</p>
      <ul>
        <li>Ne pas utiliser le service à des fins illégales ou non autorisées</li>
        <li>Ne pas tenter de contourner les mesures de sécurité du site</li>
        <li>Ne pas publier de contenu illégal, diffamatoire, offensant ou portant atteinte aux droits de tiers</li>
        <li>Ne pas usurper l'identité d'autrui</li>
        <li>Respecter les droits de propriété intellectuelle</li>
        <li>Fournir des informations exactes lors de votre inscription</li>
      </ul>

      <h3>8.3 Sanctions</h3>
      <p>
        En cas de non-respect des présentes conditions, RecetteRanger se réserve le droit
        de suspendre ou de supprimer votre compte sans préavis et sans indemnité.
      </p>
    </section>

    <!-- Modifications -->
    <section class="legal-section">
      <h2>9. Modifications des Mentions Légales</h2>
      <p>
        RecetteRanger se réserve le droit de modifier les présentes mentions légales à tout moment.
        Les modifications entrent en vigueur dès leur publication sur le site.
        Nous vous encourageons à consulter régulièrement cette page.
      </p>
    </section>

    <!-- Droit applicable -->
    <section class="legal-section">
      <h2>10. Droit Applicable et Juridiction Compétente</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français.
      </p>
      <p>
        En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux compétents
        conformément aux règles de droit commun.
      </p>
      <p>
        <strong>Juridiction compétente :</strong> Tribunal judiciaire de Lille
      </p>
    </section>

    <!-- Médiation -->
    <section class="legal-section">
      <h2>11. Médiation de la Consommation</h2>
      <p class="legal-note">
        <em>RecetteRanger est un service gratuit proposé par un particulier.
        La médiation de la consommation s'applique uniquement aux professionnels proposant des services payants.
        Cette section n'est donc pas applicable dans notre cas.</em>
      </p>
      <p>
        En cas de litige, vous pouvez toutefois contacter la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) :
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
      </p>
    </section>

    <!-- Contact -->
    <section class="legal-section">
      <h2>12. Nous Contacter</h2>
      <p>
        Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
      </p>
      <div class="contact-box">
        <p><strong>Email :</strong> <a href="mailto:mdecourtray11@gmail.com">mdecourtray11@gmail.com</a></p>
        <p><strong>Adresse postale :</strong> 116/1 rue des Francs, 59200 Tourcoing, France</p>
      </div>
    </section>
  </div>
</div>
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;

  .legal-notice {
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

  .legal-section {
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
  }

  .legal-info-box,
  .contact-box {
    background: $color-gray-50;
    border-left: 4px solid $brand-primary;
    padding: $spacing-md;
    margin: $spacing-md 0;
    border-radius: $radius-sm;

    p {
      margin: $spacing-xs 0;
      color: $color-gray-700;
    }

    strong {
      color: $color-gray-800;
    }
  }

  .legal-warning-box {
    background: $color-warning-light;
    border-left: 4px solid $color-warning;
    padding: $spacing-md;
    margin: $spacing-md 0;
    border-radius: $radius-sm;

    p {
      margin: $spacing-xs 0;
      color: $color-gray-800;
    }

    strong {
      color: $color-warning-dark;
    }

    ul {
      margin: $spacing-sm 0 0 0;
      color: $color-gray-800;
    }
  }

  .legal-note {
    font-size: $font-size-sm;
    font-style: italic;
    color: $color-gray-600;
    background: $color-info-light;
    padding: $spacing-sm;
    border-radius: $radius-sm;
    margin-top: $spacing-sm;
  }

  .legal-link {
    color: $brand-primary;
    text-decoration: underline;
    font-weight: $font-weight-semibold;

    &:hover {
      color: $brand-quaternary;
    }

    &--button {
      background: none;
      border: none;
      padding: 0;
      font-size: inherit;
      font-family: inherit;
      cursor: pointer;
    }
  }

  a {
    color: $brand-primary;
    text-decoration: underline;

    &:hover {
      color: $brand-quaternary;
    }
  }
</style>
