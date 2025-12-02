/**
 * UI Component Types
 * Types partagés pour les composants d'interface utilisateur
 */

import type { Snippet } from 'svelte';

// ============================================
// COMMON TYPES
// ============================================

export type Size = 'small' | 'medium' | 'large';

export type BadgeSize = 'xs' | 'small' | 'medium' | 'large';

export type ColorVariant =
  // Semantic colors
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  // Extended palette
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose';

// ============================================
// ARTICLE AUTOCOMPLETE
// ============================================

export interface Article {
  id: string;
  label: string;
  aisle: string;
  units: string[];
  isFood: boolean;
}

export interface ArticleAutocompleteProps {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string;
  isFood?: boolean; // Filtre: true = alimentaire only, false = non-alimentaire only, undefined = tous
  onSelect: (article: Article | null) => void;
  onCreate?: (label: string, isFood: boolean) => Promise<void>;
  allowCreate?: boolean;
}

export interface ArticleAutocompleteState {
  suggestions: Article[];
  showSuggestions: boolean;
  loading: boolean;
  selectedIndex: number;
  debounceTimer: ReturnType<typeof setTimeout> | null;
}

// ============================================
// AVATAR
// ============================================

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  icon?: Snippet;
  size?: Size;
}

// ============================================
// BADGE
// ============================================

export interface BadgeProps {
  variant?: ColorVariant;
  size?: BadgeSize;
  pill?: boolean;
  dot?: boolean;
  children?: Snippet;
}

// ============================================
// NOTIFICATION BADGE
// ============================================

export type NotificationBadgeSize = 'small' | 'medium' | 'large';
export type NotificationBadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type NotificationBadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface NotificationBadgeProps {
  count: number;
  size?: NotificationBadgeSize;
  variant?: NotificationBadgeVariant;
  position?: NotificationBadgePosition;
  animate?: boolean;
  max?: number;
}

// ============================================
// NUMBER BADGE
// ============================================

export type NumberBadgeSize = 'small' | 'medium' | 'large';
export type NumberBadgeVariant = 'filled' | 'outlined' | 'ghost';
export type NumberBadgeColor = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export type NumberBadgeShape = 'circle' | 'rounded' | 'square';

export interface NumberBadgeProps {
  number: number | string;
  size?: NumberBadgeSize;
  variant?: NumberBadgeVariant;
  color?: NumberBadgeColor;
  shape?: NumberBadgeShape;
}

// ============================================
// PAGE HERO
// ============================================

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: Snippet;
  onAction?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchInput?: (e: Event) => void;
  progress?: Snippet;
  filters?: Snippet;
  children?: Snippet;
}

// ============================================
// PROGRESS BAR
// ============================================

export type ProgressBarSize = 'small' | 'medium' | 'large';
export type ProgressBarVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface ProgressBarProps {
  value: number; // Valeur actuelle (0-max)
  max?: number; // Valeur maximale
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  showLabel?: boolean; // Afficher le label en pourcentage
  label?: string; // Label personnalisé à afficher
  animated?: boolean; // Animation de progression
}

// ============================================
// AUTHOR LINK
// ============================================

export interface AuthorLinkProps {
  authorId: string;
  authorPseudo: string;
  authorAvatar?: string | null;
  size?: Size;
  clickable?: boolean;
}

// ============================================
// BREADCRUMB
// ============================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onclick?: () => void;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  mode?: 'full' | 'simple';
  showHomeIcon?: boolean;
  separator?: string;
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
}

export interface BackButtonProps {
  label?: string;
  href?: string;
  onclick?: () => void;
  iconSize?: number;
}

// ============================================
// BUTTON
// ============================================

export type ButtonVariant =
  | 'primary' | 'primary-inverse'
  | 'secondary' | 'secondary-inverse'
  | 'tertiary'
  | 'outlined' | 'outlined-inverse'
  | 'ghost' | 'ghost-inverse'
  | 'danger' | 'danger-inverse'
  | 'success' | 'success-inverse';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onclick?: (e: MouseEvent) => void;
  children?: Snippet;
  // Props for rendering as link
  element?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

// ============================================
// LINK
// ============================================

export type LinkVariant = 'primary' | 'secondary' | 'inverse';

export interface LinkProps {
  href: string;
  variant?: LinkVariant;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  fullWidth?: boolean;
  target?: string;
  rel?: string;
  children?: Snippet;
}

// ============================================
// CARD
// ============================================

export interface CardProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  imagePlaceholder?: string;
  clickable?: boolean;
  onclick?: () => void;
  header?: Snippet;
  content?: Snippet;
  footer?: Snippet;
  children?: Snippet;
}

// ============================================
// CONFIRM MODAL
// ============================================

export interface ConfirmModalProps {
  isOpen?: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// ============================================
// DOT
// ============================================

export type DotSize = 'xs' | 'small' | 'medium' | 'large';

export interface DotProps {
  color?: string;
  size?: DotSize;
}

// ============================================
// DRAWER
// ============================================

export interface DrawerAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface DrawerProps {
  isOpen?: boolean;
  title?: string;
  showBackButton?: boolean;
  position?: 'left' | 'right';
  variant?: 'default' | 'navigation';
  onClose: () => void;
  onBack?: () => void;
  primaryAction?: DrawerAction;
  secondaryAction?: Omit<DrawerAction, 'loading'>;
  children?: Snippet;
}

// ============================================
// FORM DRAWER
// ============================================

export interface DuplicateItem {
  id: string;
  label: string;
  similarity?: number;
  [key: string]: any;
}

export interface FormDrawerProps {
  isOpen?: boolean;
  title: string;
  mode?: 'create' | 'edit';
  saving?: boolean;
  errors?: Record<string, string>;
  duplicates?: DuplicateItem[];
  checkingDuplicates?: boolean;
  duplicateMessage?: string;
  onSave: () => void | Promise<void>;
  onClose: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  children?: Snippet;
}

// ============================================
// SECTION TITLE
// ============================================

export type SectionTitleLevel = 2 | 3 | 4;
export type SectionTitleVariant = 'default' | 'inverse';

export interface SectionTitleProps {
  level?: SectionTitleLevel;
  variant?: SectionTitleVariant;
  children?: Snippet;
}

// ============================================
// DROPDOWN
// ============================================

export type DropdownAlign = 'left' | 'right';

export interface DropdownProps {
  trigger?: Snippet;
  children?: Snippet;
  isOpen?: boolean;
  align?: DropdownAlign;
  minWidth?: string;
}

// ============================================
// FILTER
// ============================================

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export type FilterDisplayMode = 'pills' | 'accordion' | 'dropdown' | 'select';

export interface FilterProps {
  label?: string;
  options: FilterOption[];
  value?: string | string[];
  multiple?: boolean;
  showCounts?: boolean;
  mode?: FilterDisplayMode;
  onchange?: (value: string | string[]) => void;
  children?: Snippet;
}

// ============================================
// FILTER GROUP
// ============================================

export interface FilterGroupOption {
  value: string;
  label: string;
}

export interface FilterGroupProps {
  label: string;
  value?: string;
  options: FilterGroupOption[];
  onchange?: () => void;
  inverse?: boolean;
}

// ============================================
// HERO
// ============================================

export type HeroVariant = 'default' | 'grid' | 'compact';
export type HeroTextAlign = 'left' | 'center' | 'right';

export interface HeroProps {
  variant?: HeroVariant;
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  textAlign?: HeroTextAlign;
  padding?: string;
  children?: Snippet;
}

// ============================================
// ICON BUTTON
// ============================================

export type IconButtonVariant =
  | 'default'
  | 'danger'
  | 'success'
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'ghost-inverse'
  | 'outlined-inverse';

export type IconButtonSize = 'small' | 'medium' | 'large' | 'x-large' | '2x-large';

export type IconButtonShape = 'circle' | 'square' | 'rectangle';

export interface IconButtonProps {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  onclick?: (e: MouseEvent) => void;
  ariaLabel?: string;
  children?: Snippet;
}

// ============================================
// IMAGE UPLOAD
// ============================================

export type ImageUploadCropShape = 'rect' | 'circle';
export type ImageUploadVariant = 'default' | 'inverse';

export interface ImageUploadProps {
  value?: string | null;
  onUpload: (url: string) => void;
  aspectRatio?: number;
  cropShape?: ImageUploadCropShape;
  maxSizeMB?: number;
  variant?: ImageUploadVariant;
}

// ============================================
// LIST ITEM
// ============================================

export interface ListItemProps {
  imageUrl?: string;
  imagePlaceholder?: Snippet;
  title: string;
  subtitle?: string;
  metadata?: string[];
  badge?: Snippet;
  footer?: Snippet;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  children?: Snippet;
  draggable?: boolean;
  dragHandleSlot?: Snippet;
  checkable?: boolean;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  showThumbnail?: boolean;
}

// ============================================
// ICON TEXT
// ============================================

export type IconTextVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export type IconTextSize = 'small' | 'medium' | 'large';

export interface IconTextProps {
  icon: Snippet;
  title: string;
  description?: string;
  variant?: IconTextVariant;
  size?: IconTextSize;
  disabled?: boolean;
  class?: string;
}

// ============================================
// LOADER
// ============================================

export type LoaderSize = 'small' | 'medium' | 'large';
export type LoaderVariant = 'primary' | 'secondary' | 'white';

export interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  message?: string;
  fullScreen?: boolean;
}

// ============================================
// LOGO
// ============================================

export type LogoVariant = 'default' | 'landing' | 'home' | 'public';

export interface LogoProps {
  variant?: LogoVariant;
  href?: string;
}

// ============================================
// MODAL
// ============================================

export type ModalSize = 'small' | 'medium' | 'large';

export interface ModalAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  isOpen?: boolean;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  onClose: () => void;
  primaryAction?: ModalAction;
  secondaryAction?: Omit<ModalAction, 'loading'>;
  dangerAction?: Omit<ModalAction, 'loading'>;
  children?: Snippet;
}

// ============================================
// SPINNER
// ============================================

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'white';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  class?: string;
}

// ============================================
// STEP ITEM
// ============================================

export interface StepItemProps {
  stepNumber: number;
  description: string;
  duration?: string;
  badgeColor?: NumberBadgeColor;
  badgeSize?: NumberBadgeSize;
  badgeVariant?: NumberBadgeVariant;
  badgeShape?: NumberBadgeShape;
}

// ============================================
// STORE AUTOCOMPLETE
// ============================================

export interface Store {
  id: string;
  name: string;
  logoUrl?: string | null;
  color?: string | null;
}

export interface StoreAutocompleteProps {
  id?: string;
  value?: string;
  placeholder?: string;
  onSelect?: (store: Store | null) => void;
  onCreateNew?: (searchValue: string) => void;
  disabled?: boolean;
}

export interface StoreAutocompleteState {
  searchResults: Store[];
  showDropdown: boolean;
  selectedStore: Store | null;
  searching: boolean;
}

// ============================================
// TAG
// ============================================

export type TagColorVariant =
  // Semantic colors
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  // Inverse variants (for dark backgrounds)
  | 'primary-inverse' | 'info-inverse'
  // Extended palette (using ColorVariant colors)
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose';

export type TagSize = 'xs' | 'small' | 'medium' | 'large';

export interface TagProps {
  variant?: TagColorVariant;
  size?: TagSize;
  removable?: boolean;
  onRemove?: () => void;
  onclick?: () => void;
  children?: Snippet;
}

// ============================================
// TILE
// ============================================

export interface TileProps {
  title?: string;
  subtitle?: string;
  icon?: Snippet;
  clickable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onclick?: () => void;
  children?: Snippet;
}

// ============================================
// TITLE
// ============================================

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TitleAlign = 'left' | 'center' | 'right';

export type TitleSize = 's' | 'm' | 'l';

export interface TitleProps {
  level?: TitleLevel;
  as?: TitleTag;
  align?: TitleAlign;
  size?: TitleSize;
  gradient?: boolean;
  children?: Snippet;
}

// ============================================
// ALERT
// ============================================

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  children?: Snippet;
}
