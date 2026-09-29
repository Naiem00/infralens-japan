import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, SectionHeader, StatCard } from '../components/ui/index.js';
import './DesignSystemPage.css';

// DEV-ONLY style guide (route /design-system, excluded from production builds in App.jsx).
// Exists so the design system can be checked visually. Not a product feature, not in the nav.
// Its copy IS translated (via common.json's designSystem.* keys) so EN/JA switching can be
// exercised here too, even though the page itself never ships to users.

const palette = [
  '--bg-primary',
  '--bg-secondary',
  '--bg-card',
  '--accent',
  '--accent-hover',
  '--text-primary',
  '--text-secondary',
  '--success',
  '--warning',
  '--error',
  '--border',
];

const badgeTones = ['neutral', 'info', 'success', 'warning', 'error'];

function DesignSystemPage() {
  const { t } = useTranslation();

  return (
    <div className="stack stack--lg">
      <SectionHeader
        level={1}
        title={t('designSystem.title')}
        description={t('designSystem.description')}
        actions={<Badge tone="warning">{t('designSystem.devOnly')}</Badge>}
      />

      <section className="stack stack--sm">
        <SectionHeader level={2} title={t('designSystem.sections.colors')} />
        <div className="grid-auto">
          {palette.map((token) => (
            <div key={token} className="ds-swatch">
              <span className="ds-swatch__chip" style={{ background: `var(${token})` }} aria-hidden="true" />
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title={t('designSystem.sections.typography')} />
        <Card className="stack stack--sm">
          <p>Inter — {t('designSystem.typography.sample')}</p>
          <p lang="ja">Noto Sans JP — アーキテクチャの信頼性・セキュリティ・コスト効率を診断します。</p>
        </Card>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title={t('designSystem.sections.buttons')} />
        <div className="cluster">
          <Button>{t('designSystem.buttons.primary')}</Button>
          <Button variant="secondary">{t('designSystem.buttons.secondary')}</Button>
          <Button variant="ghost">{t('designSystem.buttons.ghost')}</Button>
          <Button size="sm">{t('designSystem.buttons.small')}</Button>
          <Button disabled>{t('designSystem.buttons.disabled')}</Button>
          <Button to="/" variant="secondary">
            {t('designSystem.buttons.link')}
          </Button>
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title={t('designSystem.sections.badges')} />
        <div className="cluster">
          {badgeTones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {t(`designSystem.badges.${tone}`)}
            </Badge>
          ))}
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title={t('designSystem.sections.stats')} description={t('designSystem.stats.description')} />
        <div className="grid-auto">
          <StatCard
            label={t('designSystem.stats.architecturesCreated')}
            value="12"
            helper={t('designSystem.stats.sampleValue')}
            badge={<Badge>{t('common.sampleData')}</Badge>}
          />
          <StatCard
            label={t('designSystem.stats.averageScore')}
            value="68%"
            helper={t('designSystem.stats.sampleValue')}
            badge={<Badge>{t('common.sampleData')}</Badge>}
          />
          <StatCard
            label={t('designSystem.stats.savedDesigns')}
            value="3"
            helper={t('designSystem.stats.sampleValue')}
            badge={<Badge>{t('common.sampleData')}</Badge>}
          />
        </div>
      </section>
    </div>
  );
}

export default DesignSystemPage;
