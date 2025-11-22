import { cookieConsentStore, type CookieConsent } from '../../../stores/cookie-consent.store';

export function savePreferences(consent: CookieConsent): void {
  cookieConsentStore.savePreferences(consent);
}

export function acceptAllPreferences(): CookieConsent {
  const allAccepted: CookieConsent = {
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  };
  cookieConsentStore.savePreferences(allAccepted);
  return allAccepted;
}

export function rejectAllPreferences(): void {
  cookieConsentStore.rejectAll();
}

export function closePreferencesModal(): void {
  cookieConsentStore.setPreferencesVisibility(false);
}
