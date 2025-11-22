/**
 * Cookie Consent Actions
 *
 * Centralizes all actions related to cookie consent management
 */

import { cookieConsentStore } from '../../../stores/cookie-consent.store';

/**
 * Accept all cookies (necessary + optional)
 */
export function acceptAll(): void {
  cookieConsentStore.acceptAll();
}

/**
 * Reject all optional cookies (keep only necessary)
 */
export function rejectAll(): void {
  cookieConsentStore.rejectAll();
}

/**
 * Show preferences modal to customize cookie choices
 */
export function showPreferences(): void {
  cookieConsentStore.setBannerVisibility(false);
  cookieConsentStore.setPreferencesVisibility(true);
}
