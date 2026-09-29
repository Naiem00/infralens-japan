import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, SectionHeader, StatCard } from '../components/ui/index.js';
import { AssessmentHistoryChart, ScoreRadarChart, ServiceUsageChart } from '../charts/index.js';
import { RECENT_ASSESSMENTS, READINESS_SCORE, STAT_CARDS } from '../data/dashboardSampleData.js';
import './DashboardPage.css';

// Score thresholds are purely cosmetic labeling for this sample list — NOT the
// real assessment rules engine (that arrives in Day 7). Text label always
// accompanies the tone, so meaning never depends on color alone.
function getScoreTone(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

function formatDate(iso, lang) {
  return new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' });
}

function DashboardPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="stack stack--lg">
      <SectionHeader level={1} title={t('dashboard.title')} description={t('dashboard.description')} />

      <Card className="stack stack--sm" padding="sm">
        <p>
          <Badge tone="info">{t('common.sampleData')}</Badge> {t('dashboard.sampleDataNotice')}
        </p>
      </Card>

      <section className="stack stack--sm">
        <SectionHeader level={2} title={t('dashboard.sections.overview')} />
        <div className="grid-auto">
          {STAT_CARDS.map((stat) => (
            <StatCard
              key={stat.id}
              label={t(`dashboard.stats.${stat.id}`)}
              value={stat.value}
              badge={<Badge tone="info">{t('common.sampleData')}</Badge>}
            />
          ))}
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader title={t('dashboard.sections.scoreByCategory')} level={2} />
        <div className="dashboard-charts-grid">
          <Card>
            <ScoreRadarChart />
          </Card>
          <Card>
            <AssessmentHistoryChart />
          </Card>
          <Card>
            <ServiceUsageChart />
          </Card>
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader title={t('dashboard.sections.recentAssessments')} level={2} />
        <Card padding="sm" className="table-scroll">
          <table className="recent-assessments-table">
            <caption className="visually-hidden">{t('dashboard.sections.recentAssessments')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('dashboard.table.assessment')}</th>
                <th scope="col">{t('dashboard.table.score')}</th>
                <th scope="col">{t('dashboard.table.date')}</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ASSESSMENTS.map((entry) => (
                <tr key={entry.id}>
                  <th scope="row">{t(entry.nameKey)}</th>
                  <td>
                    {entry.score}/100{' '}
                    <Badge tone={getScoreTone(entry.score)}>
                      {t(`dashboard.scoreTone.${getScoreTone(entry.score)}`)}
                    </Badge>
                  </td>
                  <td>{formatDate(entry.date, i18n.resolvedLanguage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className="stack stack--sm">
        <SectionHeader title={t('productionReadiness.title')} level={2} />
        <Card className="readiness-summary">
          <div className="readiness-summary__score">
            <StatCard
              label={t('dashboard.readiness.scoreLabel')}
              value={`${READINESS_SCORE}%`}
              badge={<Badge tone="info">{t('common.sampleData')}</Badge>}
            />
          </div>
          <div className="readiness-summary__text stack stack--sm">
            <p>{t('productionReadiness.description')}</p>
            <Button to="/readiness" variant="secondary" size="sm">
              {t('dashboard.readiness.viewLink')}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default DashboardPage;
