import { useTranslation } from 'react-i18next';
import { Badge, Card, SectionHeader } from './ui/index.js';

// Shared body for feature pages that are planned but not built yet.
// Keeps the seven placeholder routes visually consistent without duplicating markup.
// `titleKey`/`descriptionKey` point into locales/*/common.json so each page's
// copy is translated without every page re-implementing useTranslation.
function PlaceholderPage({ titleKey, descriptionKey }) {
  const { t } = useTranslation();
  return (
    <div className="stack">
      <SectionHeader
        level={1}
        title={t(titleKey)}
        description={t(descriptionKey)}
        actions={<Badge tone="info">{t('common.planned')}</Badge>}
      />
      <Card>
        <p>{t('common.notImplemented')}</p>
      </Card>
    </div>
  );
}

export default PlaceholderPage;
