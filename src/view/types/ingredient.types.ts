export enum StoreAisle {
  FRUITS_ET_LEGUMES = 'FRUITS_ET_LEGUMES',
  BOUCHERIE = 'BOUCHERIE',
  VOLAILLE = 'VOLAILLE',
  CHARCUTERIE = 'CHARCUTERIE',
  POISSONNERIE = 'POISSONNERIE',
  ROTISSERIE = 'ROTISSERIE',
  BOULANGERIE = 'BOULANGERIE',
  PATISSERIE = 'PATISSERIE',
  FROMAGERIE = 'FROMAGERIE',
  TRAITEUR = 'TRAITEUR',
  PRODUITS_LAITIERS = 'PRODUITS_LAITIERS',
  OEUFS = 'OEUFS',
  SURGELES = 'SURGELES',
  EPICERIE_SALEE = 'EPICERIE_SALEE',
  PATES_RIZ_CEREALES = 'PATES_RIZ_CEREALES',
  CONSERVES = 'CONSERVES',
  SAUCES_CONDIMENTS = 'SAUCES_CONDIMENTS',
  HUILES_VINAIGRES = 'HUILES_VINAIGRES',
  EPICES_AIDES_CULINAIRES = 'EPICES_AIDES_CULINAIRES',
  PLATS_CUISINES = 'PLATS_CUISINES',
  SNACKING = 'SNACKING',
  EPICERIE_SUCREE = 'EPICERIE_SUCREE',
  BISCUITS_GATEAUX = 'BISCUITS_GATEAUX',
  CHOCOLATS_CONFISERIES = 'CHOCOLATS_CONFISERIES',
  PETIT_DEJEUNER = 'PETIT_DEJEUNER',
  CAFE_THE = 'CAFE_THE',
  EAUX = 'EAUX',
  SODAS_JUS = 'SODAS_JUS',
  BIERES = 'BIERES',
  VINS_SPIRITUEUX = 'VINS_SPIRITUEUX',
  PRODUITS_BIO = 'PRODUITS_BIO',
  SANS_GLUTEN_DIETETIQUE = 'SANS_GLUTEN_DIETETIQUE',
  BEBE = 'BEBE',
  ANIMALERIE = 'ANIMALERIE',
  ENTRETIEN_MAISON = 'ENTRETIEN_MAISON',
  LESSIVE_SOIN_LINGE = 'LESSIVE_SOIN_LINGE',
  PAPIER_HYGIENE_MENAGERE = 'PAPIER_HYGIENE_MENAGERE',
  HYGIENE_BEAUTE = 'HYGIENE_BEAUTE',
  PARAPHARMACIE = 'PARAPHARMACIE',
  PAPETERIE_FOURNITURES = 'PAPETERIE_FOURNITURES',
  PRESSE_LIVRES = 'PRESSE_LIVRES',
  MAISON_DECO = 'MAISON_DECO',
  ARTS_DE_LA_TABLE = 'ARTS_DE_LA_TABLE',
  TEXTILE = 'TEXTILE',
  ELECTROMENAGER = 'ELECTROMENAGER',
  MULTIMEDIA_HIGH_TECH = 'MULTIMEDIA_HIGH_TECH',
  BRICOLAGE = 'BRICOLAGE',
  AUTO_MOBILITE = 'AUTO_MOBILITE',
  JARDIN_PLANTES = 'JARDIN_PLANTES',
  FLEURS = 'FLEURS',
  JEUX_JOUETS = 'JEUX_JOUETS',
  SAISONNIER = 'SAISONNIER',
}

export enum Unit {
  PINCEE = 'PINCEE',
  GRAMME = 'GRAMME',
  KILOGRAMME = 'KILOGRAMME',
  MILLIGRAMME = 'MILLIGRAMME',
  LITRE = 'LITRE',
  MILLILITRE = 'MILLILITRE',
  CENTILITRE = 'CENTILITRE',
  CUILLERE_A_CAFE = 'CUILLERE_A_CAFE',
  CUILLERE_A_SOUPE = 'CUILLERE_A_SOUPE',
  TASSE = 'TASSE',
  VERRE = 'VERRE',
  BOL = 'BOL',
  UNITE = 'UNITE',
  TRANCHE = 'TRANCHE',
  MORCEAU = 'MORCEAU',
  BRANCHE = 'BRANCHE',
  FEUILLE = 'FEUILLE',
  BOUQUET = 'BOUQUET',
  BOTTE = 'BOTTE',
  GOUSSE = 'GOUSSE',
  ZESTE = 'ZESTE',
  SACHET = 'SACHET',
  BOITE = 'BOITE',
  PAQUET = 'PAQUET',
  POT = 'POT',
  BARQUETTE = 'BARQUETTE',
  ROULEAU = 'ROULEAU',
  BARIL = 'BARIL',
  BOUTEILLE = 'BOUTEILLE',
  TUBE = 'TUBE',
  BIDON = 'BIDON',
  FLACON = 'FLACON',
}

export interface Ingredient {
  id: string;
  label: string;
  aisle: StoreAisle;
  units: Unit[];
  imageUrl: string | null;
  seasonMonths: number[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientDto {
  label: string;
  aisle: StoreAisle;
  units: Unit[];
  imageUrl?: string;
  seasonMonths?: number[];
}

export interface SearchIngredientsDto {
  search?: string;
  aisle?: StoreAisle;
  unit?: Unit;
  sortBy?: 'alpha' | 'date' | 'popularity';
  limit?: number;
  page?: number;
}

export interface SimilarIngredient {
  id: string;
  label: string;
  aisle: string;
  similarity: number;
}

export interface CheckDuplicatesResponse {
  hasDuplicates: boolean;
  similarIngredients: SimilarIngredient[];
}

// Labels français pour les enums
export const StoreAisleLabels: Record<StoreAisle, string> = {
  [StoreAisle.FRUITS_ET_LEGUMES]: 'Fruits et légumes',
  [StoreAisle.BOUCHERIE]: 'Boucherie',
  [StoreAisle.VOLAILLE]: 'Volaille',
  [StoreAisle.CHARCUTERIE]: 'Charcuterie',
  [StoreAisle.POISSONNERIE]: 'Poissonnerie',
  [StoreAisle.ROTISSERIE]: 'Rôtisserie',
  [StoreAisle.BOULANGERIE]: 'Boulangerie',
  [StoreAisle.PATISSERIE]: 'Pâtisserie',
  [StoreAisle.FROMAGERIE]: 'Fromagerie',
  [StoreAisle.TRAITEUR]: 'Traiteur',
  [StoreAisle.PRODUITS_LAITIERS]: 'Produits laitiers',
  [StoreAisle.OEUFS]: 'Œufs',
  [StoreAisle.SURGELES]: 'Surgelés',
  [StoreAisle.EPICERIE_SALEE]: 'Épicerie salée',
  [StoreAisle.PATES_RIZ_CEREALES]: 'Pâtes, riz & céréales',
  [StoreAisle.CONSERVES]: 'Conserves',
  [StoreAisle.SAUCES_CONDIMENTS]: 'Sauces & condiments',
  [StoreAisle.HUILES_VINAIGRES]: 'Huiles & vinaigres',
  [StoreAisle.EPICES_AIDES_CULINAIRES]: 'Épices & aides culinaires',
  [StoreAisle.PLATS_CUISINES]: 'Plats cuisinés',
  [StoreAisle.SNACKING]: 'Snacking (sandwichs & salades)',
  [StoreAisle.EPICERIE_SUCREE]: 'Épicerie sucrée',
  [StoreAisle.BISCUITS_GATEAUX]: 'Biscuits & gâteaux',
  [StoreAisle.CHOCOLATS_CONFISERIES]: 'Chocolats & confiseries',
  [StoreAisle.PETIT_DEJEUNER]: 'Petit-déjeuner (céréales & tartinables)',
  [StoreAisle.CAFE_THE]: 'Café & thé',
  [StoreAisle.EAUX]: 'Eaux',
  [StoreAisle.SODAS_JUS]: 'Sodas & jus',
  [StoreAisle.BIERES]: 'Bières',
  [StoreAisle.VINS_SPIRITUEUX]: 'Vins & spiritueux',
  [StoreAisle.PRODUITS_BIO]: 'Produits bio',
  [StoreAisle.SANS_GLUTEN_DIETETIQUE]: 'Sans gluten & diététique',
  [StoreAisle.BEBE]: 'Bébé (alimentaire & soins)',
  [StoreAisle.ANIMALERIE]: 'Animalerie',
  [StoreAisle.ENTRETIEN_MAISON]: 'Entretien de la maison',
  [StoreAisle.LESSIVE_SOIN_LINGE]: 'Lessive & soin du linge',
  [StoreAisle.PAPIER_HYGIENE_MENAGERE]: 'Papier & hygiène ménagère',
  [StoreAisle.HYGIENE_BEAUTE]: 'Hygiène & beauté',
  [StoreAisle.PARAPHARMACIE]: 'Parapharmacie',
  [StoreAisle.PAPETERIE_FOURNITURES]: 'Papeterie & fournitures',
  [StoreAisle.PRESSE_LIVRES]: 'Presse & livres',
  [StoreAisle.MAISON_DECO]: 'Maison & déco',
  [StoreAisle.ARTS_DE_LA_TABLE]: 'Arts de la table',
  [StoreAisle.TEXTILE]: 'Textile',
  [StoreAisle.ELECTROMENAGER]: 'Électroménager',
  [StoreAisle.MULTIMEDIA_HIGH_TECH]: 'Multimédia & high-tech',
  [StoreAisle.BRICOLAGE]: 'Bricolage',
  [StoreAisle.AUTO_MOBILITE]: 'Auto & mobilité',
  [StoreAisle.JARDIN_PLANTES]: 'Jardin & plantes',
  [StoreAisle.FLEURS]: 'Fleurs',
  [StoreAisle.JEUX_JOUETS]: 'Jeux & jouets',
  [StoreAisle.SAISONNIER]: 'Saisonnier',
};

export const UnitLabels: Record<Unit, string> = {
  [Unit.PINCEE]: 'pincée',
  [Unit.GRAMME]: 'g',
  [Unit.KILOGRAMME]: 'kg',
  [Unit.MILLIGRAMME]: 'mg',
  [Unit.LITRE]: 'l',
  [Unit.MILLILITRE]: 'ml',
  [Unit.CENTILITRE]: 'cl',
  [Unit.CUILLERE_A_CAFE]: 'cuillère à café',
  [Unit.CUILLERE_A_SOUPE]: 'cuillère à soupe',
  [Unit.TASSE]: 'tasse',
  [Unit.VERRE]: 'verre',
  [Unit.BOL]: 'bol',
  [Unit.UNITE]: 'unité',
  [Unit.TRANCHE]: 'tranche',
  [Unit.MORCEAU]: 'morceau',
  [Unit.BRANCHE]: 'branche',
  [Unit.FEUILLE]: 'feuille',
  [Unit.BOUQUET]: 'bouquet',
  [Unit.BOTTE]: 'botte',
  [Unit.GOUSSE]: 'gousse',
  [Unit.ZESTE]: 'zeste',
  [Unit.SACHET]: 'sachet',
  [Unit.BOITE]: 'boîte',
  [Unit.PAQUET]: 'paquet',
  [Unit.POT]: 'pot',
  [Unit.BARQUETTE]: 'barquette',
  [Unit.ROULEAU]: 'rouleau',
  [Unit.BARIL]: 'baril',
  [Unit.BOUTEILLE]: 'bouteille',
  [Unit.TUBE]: 'tube',
  [Unit.BIDON]: 'bidon',
  [Unit.FLACON]: 'flacon',
};

export const MONTHS = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
];
