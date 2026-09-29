import { useTranslation } from 'react-i18next';
import './SkipLink.css';

// First focusable element on the page: lets keyboard users jump past the navigation.
function SkipLink() {
  const { t } = useTranslation();
  return (
    <a className="skip-link" href="#main-content">
      {t('a11y.skipToContent')}
    </a>
  );
}

export default SkipLink;
