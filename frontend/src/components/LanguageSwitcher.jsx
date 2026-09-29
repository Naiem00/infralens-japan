import { useTranslation } from 'react-i18next';
import { LANGUAGES, changeLanguage } from '../i18n/index.js';
import { classNames } from '../utils/classNames.js';
import './LanguageSwitcher.css';

// Two real <button> elements in a group, not a <select> — a visible toggle
// matches "EN | JP" from the project spec and needs no extra keyboard handling
// beyond default Tab/Enter/Space, which every browser gives buttons for free.
function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  return (
    <div className="lang-switch" role="group" aria-label={t('language.switcherLabel')}>
      {LANGUAGES.map(({ code, shortLabel, labelKey }) => {
        const isActive = current === code;
        return (
          <button
            key={code}
            type="button"
            className={classNames('lang-switch__option', isActive && 'is-active')}
            aria-pressed={isActive}
            aria-label={t(labelKey)}
            disabled={isActive}
            onClick={() => changeLanguage(code)}
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
