import { useTranslation } from 'react-i18next';
import { Button, Card, SectionHeader } from '../components/ui/index.js';

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="stack">
      <SectionHeader level={1} title={t('notFound.title')} description={t('notFound.description')} />
      <Card>
        <Button to="/">{t('notFound.backToDashboard')}</Button>
      </Card>
    </div>
  );
}

export default NotFoundPage;
