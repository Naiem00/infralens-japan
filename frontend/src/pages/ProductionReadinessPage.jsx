import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProductionReadinessPage.css';

const CHECKS = [
  { id: 'mfa', category: 'security' },
  { id: 'leastPrivilege', category: 'security' },
  { id: 'encryption', category: 'security' },

  { id: 'multiAz', category: 'reliability' },
  { id: 'backups', category: 'reliability' },
  { id: 'scaling', category: 'reliability' },

  { id: 'logs', category: 'monitoring' },
  { id: 'alarms', category: 'monitoring' },
  { id: 'auditTrail', category: 'monitoring' },

  { id: 'runbook', category: 'operations' },
  { id: 'costReview', category: 'operations' },
  { id: 'recoveryTest', category: 'operations' },
];

const CATEGORIES = ['security', 'reliability', 'monitoring', 'operations'];

function ProductionReadinessPage() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState({});

  const completed = useMemo(
    () => CHECKS.filter((item) => checked[item.id]).length,
    [checked],
  );

  const percentage = Math.round((completed / CHECKS.length) * 100);

  const toggle = (id) => {
    setChecked((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <section className="readiness-page stack">
      <header className="readiness-page__header stack stack--sm">
        <p className="readiness-page__eyebrow">{t('productionReadiness.eyebrow')}</p>
        <h1>{t('productionReadiness.title')}</h1>
        <p className="readiness-page__description">
          {t('productionReadiness.description')}
        </p>
      </header>

      <section className="readiness-summary" aria-labelledby="readiness-summary-title">
        <div>
          <h2 id="readiness-summary-title">
            {t('productionReadiness.summary.title')}
          </h2>
          <p>
            {t('productionReadiness.summary.completed', {
              completed,
              total: CHECKS.length,
            })}
          </p>
        </div>

        <strong className="readiness-summary__score" aria-live="polite">
          {percentage}%
        </strong>

        <div
          className="readiness-progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={percentage}
          aria-label={t('productionReadiness.summary.progressLabel')}
        >
          <span style={{ width: `${percentage}%` }} />
        </div>
      </section>

      <div className="readiness-grid">
        {CATEGORIES.map((category) => (
          <section
            key={category}
            className="readiness-card"
            aria-labelledby={`readiness-${category}`}
          >
            <h2 id={`readiness-${category}`}>
              {t(`productionReadiness.categories.${category}`)}
            </h2>

            <div className="readiness-checks">
              {CHECKS.filter((item) => item.category === category).map((item) => (
                <label className="readiness-check" key={item.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={() => toggle(item.id)}
                  />

                  <span>
                    <strong>
                      {t(`productionReadiness.checks.${item.id}.title`)}
                    </strong>
                    <small>
                      {t(`productionReadiness.checks.${item.id}.description`)}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="readiness-page__notice">
        {t('productionReadiness.notice')}
      </p>
    </section>
  );
}

export default ProductionReadinessPage;
