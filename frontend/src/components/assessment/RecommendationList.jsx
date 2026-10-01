import { useTranslation } from 'react-i18next';
import { Badge, Card } from '../ui/index.js';
import { PRIORITY_IDS } from '../../recommendations/index.js';
import { priorityToBadgeTone } from './priorityTone.js';
import './RecommendationList.css';

function RecommendationList({ recommendations }) {
  const { t } = useTranslation();

  if (!recommendations || recommendations.length === 0) {
    return <p className="recommendation-list__empty">{t('recommendations.empty')}</p>;
  }

  return (
    <div className="recommendation-list">
      {PRIORITY_IDS.map((priority) => {
        const items = recommendations.filter((rec) => rec.priority === priority);
        if (items.length === 0) return null;

        return (
          <section key={priority} className="recommendation-group" aria-labelledby={`rec-priority-${priority}`}>
            <h4 id={`rec-priority-${priority}`} className="recommendation-group__heading">
              {t(`recommendations.priorities.${priority}`)}
            </h4>
            <ul className="recommendation-group__items">
              {items.map((rec) => (
                <li key={rec.id}>
                  <Card className="recommendation-card stack stack--sm">
                    <div className="recommendation-card__header">
                      <Badge tone={priorityToBadgeTone(rec.priority)}>
                        {t(`recommendations.priorities.${rec.priority}`)}
                      </Badge>
                      <Badge tone="neutral">{t(`categories.${rec.category}`)}</Badge>
                    </div>
                    <h5 className="recommendation-card__title">{t(rec.titleKey)}</h5>
                    <p className="recommendation-card__explanation">{t(rec.explanationKey)}</p>
                    <p className="recommendation-card__concept">
                      <span className="recommendation-card__concept-label">{t('recommendations.conceptLabel')}: </span>
                      {t(rec.conceptKey)}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default RecommendationList;
