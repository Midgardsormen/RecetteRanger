export type ShoppingListStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export type StoreAisle =
  | 'FRUITS_ET_LEGUMES'
  | 'BOUCHERIE'
  | 'VOLAILLE'
  | 'CHARCUTERIE'
  | 'POISSONNERIE'
  | 'ROTISSERIE'
  | 'BOULANGERIE'
  | 'PATISSERIE'
  | 'FROMAGERIE'
  | 'TRAITEUR'
  | 'PRODUITS_LAITIERS'
  | 'OEUFS'
  | 'SURGELES'
  | 'EPICERIE_SALEE'
  | 'PATES_RIZ_CEREALES'
  | 'CONSERVES'
  | 'SAUCES_CONDIMENTS'
  | 'HUILES_VINAIGRES'
  | 'EPICES_AIDES_CULINAIRES'
  | 'PLATS_CUISINES'
  | 'SNACKING'
  | 'EPICERIE_SUCREE'
  | 'BISCUITS_GATEAUX'
  | 'CHOCOLATS_CONFISERIES'
  | 'PETIT_DEJEUNER'
  | 'CAFE_THE'
  | 'EAUX'
  | 'SODAS_JUS'
  | 'BIERES'
  | 'VINS_SPIRITUEUX'
  | 'PRODUITS_BIO'
  | 'SANS_GLUTEN_DIETETIQUE'
  | 'BEBE'
  | 'ANIMALERIE'
  | 'ENTRETIEN_MAISON'
  | 'LESSIVE_SOIN_LINGE'
  | 'PAPIER_HYGIENE_MENAGERE'
  | 'HYGIENE_BEAUTE'
  | 'PARAPHARMACIE'
  | 'PAPETERIE_FOURNITURES'
  | 'PRESSE_LIVRES'
  | 'MAISON_DECO'
  | 'ARTS_DE_LA_TABLE'
  | 'TEXTILE'
  | 'ELECTROMENAGER'
  | 'MULTIMEDIA_HIGH_TECH'
  | 'BRICOLAGE'
  | 'AUTO_MOBILITE'
  | 'JARDIN_PLANTES'
  | 'FLEURS'
  | 'JEUX_JOUETS'
  | 'SAISONNIER';

export interface ShoppingListItem {
  id: string;
  listId: string;
  ingredientId: string | null;
  label: string;
  aisle: StoreAisle | null;
  quantity: number | null;
  unit: string | null;
  checked: boolean;
  note: string | null;
  isManual: boolean;
  mealPlanItemIds: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  fromDate: Date | string | null;
  toDate: Date | string | null;
  status: ShoppingListStatus;
  items: ShoppingListItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateShoppingListItemDto {
  ingredientId?: string;
  label: string;
  aisle?: StoreAisle;
  quantity?: number;
  unit?: string;
  checked?: boolean;
  note?: string;
  isManual?: boolean;
  mealPlanItemIds?: string[];
}

export interface CreateShoppingListDto {
  name: string;
  fromDate?: string;
  toDate?: string;
  items?: CreateShoppingListItemDto[];
}

export interface GenerateShoppingListDto {
  fromDate: string;
  toDate: string;
  name?: string;
}

export interface UpdateShoppingListItemDto {
  label?: string;
  aisle?: StoreAisle;
  quantity?: number;
  unit?: string;
  checked?: boolean;
  note?: string;
}

export interface UpdateShoppingListDto {
  name?: string;
  fromDate?: string;
  toDate?: string;
  status?: ShoppingListStatus;
}
