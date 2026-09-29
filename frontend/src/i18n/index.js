import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/common.json';
import ja from '../locales/ja/common.json';

// `code` is the BCP 47 tag used by i18next and <html lang>.
// `shortLabel` is the abbreviation shown on the switcher button (a code, not prose, so it is not translated).
// `labelKey` points at the full, accessible name of the language (an endonym: "English", "日本語").
export const LANGUAGES = [
  { code: 'en', shortLabel: 'EN', labelKey: 'language.options.en' },
  { code: 'ja', shortLabel: 'JP', labelKey: 'language.options.ja' },
];

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'infralens.language';

const supportedCodes = LANGUAGES.map(({ code }) => code);

function readSavedLanguage() {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return supportedCodes.includes(saved) ? saved : null;
  } catch {
    // localStorage can throw (blocked storage, some private modes). Using the default is fine.
    return null;
  }
}

function saveLanguage(code) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch {
    // Persistence is a convenience; the switch still works for this session.
  }
}

// Keeps <html lang> in sync so screen readers pick the right voice, browsers pick the right
// CJK glyph variants, and the :lang() CSS rules apply.
function syncHtmlLang(code) {
  document.documentElement.lang = code;
}

i18n.on('languageChanged', (code) => syncHtmlLang(i18n.resolvedLanguage || code));

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    ja: { common: ja },
  },
  // Saved choice wins; otherwise English. Browser language detection is intentionally not used (yet).
  lng: readSavedLanguage() ?? DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: supportedCodes,
  ns: ['common'],
  defaultNS: 'common',
  // Translations are bundled, so loading is synchronous: no "flash of translation keys".
  initAsync: false,
  interpolation: { escapeValue: false }, // React already escapes rendered output
  react: { useSuspense: false },
});

syncHtmlLang(i18n.resolvedLanguage || DEFAULT_LANGUAGE);

// The only function the UI should use to switch language: validates, persists, then switches.
// Persistence happens on an explicit user choice only, never on first load, so the stored
// value always means "the user picked this".
export function changeLanguage(code) {
  if (!supportedCodes.includes(code)) {
    return Promise.resolve();
  }
  saveLanguage(code);
  return i18n.changeLanguage(code);
}

export default i18n;
