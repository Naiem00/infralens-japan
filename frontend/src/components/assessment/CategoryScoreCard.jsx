import { useTranslation } from 'react-i18next';
import { Badge, Card } from '../ui/index.js';
import RuleImpactList from './RuleImpactList.jsx';
import { ratingToBadgeTone } from './ratingTone.js';
import './CategoryScoreCard.css';

// One category's full story in one card: name, numeric score (never color-only
// — the number and the text rating are always shown), and exactly which rules
// produced that score.
function CategoryScoreCard({ categoryId, score, ratingKey, rules }) {
  const { t } = useTranslation();

  return (
    <Card className="category-score-card stack stack--sm" as="section" aria-labelledby={`category-${categoryId}`}>
      <div className="category-score-card__header">
        <h3 id={`category-${categoryId}`} className="category-score-card__name">
          {t(`categories.${categoryId}`)}
        </h3>
        <div className="category-score-card__score">
          <span className="category-score-card__number">{score}</span>
          <span className="category-score-card__max">/ 100</span>
        </div>
      </div>
      <Badge tone={ratingToBadgeTone(ratingKey)}>{t(`assessment.ratings.${ratingKey}`)}</Badge>
      <RuleImpactList rules={rules} />
    </Card>
  );
}

export default CategoryScoreCard;
