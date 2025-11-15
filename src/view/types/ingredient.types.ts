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
export type BadgeVariant =
  // Semantic colors
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  // Extended palette
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose';

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

export const StoreAisleColors: Record<StoreAisle, BadgeVariant> = {
  [StoreAisle.FRUITS_ET_LEGUMES]: 'green',
  [StoreAisle.BOUCHERIE]: 'red',
  [StoreAisle.VOLAILLE]: 'orange',
  [StoreAisle.CHARCUTERIE]: 'rose',
  [StoreAisle.POISSONNERIE]: 'cyan',
  [StoreAisle.ROTISSERIE]: 'amber',
  [StoreAisle.BOULANGERIE]: 'yellow',
  [StoreAisle.PATISSERIE]: 'pink',
  [StoreAisle.FROMAGERIE]: 'lime',
  [StoreAisle.TRAITEUR]: 'purple',
  [StoreAisle.PRODUITS_LAITIERS]: 'sky',
  [StoreAisle.OEUFS]: 'yellow',
  [StoreAisle.SURGELES]: 'cyan',
  [StoreAisle.EPICERIE_SALEE]: 'amber',
  [StoreAisle.PATES_RIZ_CEREALES]: 'yellow',
  [StoreAisle.CONSERVES]: 'orange',
  [StoreAisle.SAUCES_CONDIMENTS]: 'red',
  [StoreAisle.HUILES_VINAIGRES]: 'lime',
  [StoreAisle.EPICES_AIDES_CULINAIRES]: 'orange',
  [StoreAisle.PLATS_CUISINES]: 'violet',
  [StoreAisle.SNACKING]: 'amber',
  [StoreAisle.EPICERIE_SUCREE]: 'pink',
  [StoreAisle.BISCUITS_GATEAUX]: 'rose',
  [StoreAisle.CHOCOLATS_CONFISERIES]: 'fuchsia',
  [StoreAisle.PETIT_DEJEUNER]: 'amber',
  [StoreAisle.CAFE_THE]: 'emerald',
  [StoreAisle.EAUX]: 'blue',
  [StoreAisle.SODAS_JUS]: 'orange',
  [StoreAisle.BIERES]: 'amber',
  [StoreAisle.VINS_SPIRITUEUX]: 'purple',
  [StoreAisle.PRODUITS_BIO]: 'green',
  [StoreAisle.SANS_GLUTEN_DIETETIQUE]: 'lime',
  [StoreAisle.BEBE]: 'pink',
  [StoreAisle.ANIMALERIE]: 'orange',
  [StoreAisle.ENTRETIEN_MAISON]: 'teal',
  [StoreAisle.LESSIVE_SOIN_LINGE]: 'sky',
  [StoreAisle.PAPIER_HYGIENE_MENAGERE]: 'cyan',
  [StoreAisle.HYGIENE_BEAUTE]: 'rose',
  [StoreAisle.PARAPHARMACIE]: 'emerald',
  [StoreAisle.PAPETERIE_FOURNITURES]: 'indigo',
  [StoreAisle.PRESSE_LIVRES]: 'violet',
  [StoreAisle.MAISON_DECO]: 'purple',
  [StoreAisle.ARTS_DE_LA_TABLE]: 'fuchsia',
  [StoreAisle.TEXTILE]: 'pink',
  [StoreAisle.ELECTROMENAGER]: 'neutral',
  [StoreAisle.MULTIMEDIA_HIGH_TECH]: 'indigo',
  [StoreAisle.BRICOLAGE]: 'orange',
  [StoreAisle.AUTO_MOBILITE]: 'neutral',
  [StoreAisle.JARDIN_PLANTES]: 'green',
  [StoreAisle.FLEURS]: 'pink',
  [StoreAisle.JEUX_JOUETS]: 'rose',
  [StoreAisle.SAISONNIER]: 'violet',
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

export type TagVariant =
  // Semantic colors
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  // Extended palette
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose';

export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER',
}

export const SeasonColors: Record<Season, TagVariant> = {
  [Season.SPRING]: 'green',
  [Season.SUMMER]: 'amber',
  [Season.AUTUMN]: 'red',
  [Season.WINTER]: 'blue',
};

// Mapping mois -> saison
export const MonthToSeason: Record<number, Season> = {
  1: Season.WINTER,
  2: Season.WINTER,
  3: Season.SPRING,
  4: Season.SPRING,
  5: Season.SPRING,
  6: Season.SUMMER,
  7: Season.SUMMER,
  8: Season.SUMMER,
  9: Season.AUTUMN,
  10: Season.AUTUMN,
  11: Season.AUTUMN,
  12: Season.WINTER,
};

export const MONTHS = [
  { value: 1, label: 'Janvier', abbr: 'JAN' },
  { value: 2, label: 'Février', abbr: 'FEV' },
  { value: 3, label: 'Mars', abbr: 'MAR' },
  { value: 4, label: 'Avril', abbr: 'AVR' },
  { value: 5, label: 'Mai', abbr: 'MAI' },
  { value: 6, label: 'Juin', abbr: 'JUI' },
  { value: 7, label: 'Juillet', abbr: 'JUL' },
  { value: 8, label: 'Août', abbr: 'AOU' },
  { value: 9, label: 'Septembre', abbr: 'SEP' },
  { value: 10, label: 'Octobre', abbr: 'OCT' },
  { value: 11, label: 'Novembre', abbr: 'NOV' },
  { value: 12, label: 'Décembre', abbr: 'DEC' },
];
