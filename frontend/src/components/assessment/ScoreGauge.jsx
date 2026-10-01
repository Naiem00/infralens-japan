import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/index.js';
import { ratingToBadgeTone } from './ratingTone.js';
import './ScoreGauge.css';

// Decorative ring (conic-gradient from existing tokens, no chart library) +
// the real accessible content: a plain "72 / 100" number and a text rating
// label. The ring is aria-hidden — nothing here depends on the ring to be understood.
function ScoreGauge({ score, ratingKey, labelText }) {
  const { t } = useTranslation();
  const tone = ratingToBadgeTone(ratingKey);
  const ringColorVar = `var(--${tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : 'error'})`;
  const degrees = (Math.max(0, Math.min(100, score)) / 100) * 360;

  return (
    <div className="score-gauge">
      <div
        className="score-gauge__ring"
        aria-hidden="true"
        style={{
          background: `conic-gradient(${ringColorVar} ${degrees}deg, var(--border) ${degrees}deg)`,
        }}
      >
        <div className="score-gauge__ring-inner">
          <span className="score-gauge__value">{score}</span>
          <span className="score-gauge__max">/ 100</span>
        </div>
      </div>
      <div className="score-gauge__meta">
        {labelText && <p className="score-gauge__label">{labelText}</p>}
        <Badge tone={tone}>{t(`assessment.ratings.${ratingKey}`)}</Badge>
      </div>
    </div>
  );
}

export default ScoreGauge;
