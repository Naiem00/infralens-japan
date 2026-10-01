import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Card } from '../ui/index.js';
import ScoreGauge from './ScoreGauge.jsx';
import CategoryScoreCard from './CategoryScoreCard.jsx';
import RecommendationList from './RecommendationList.jsx';
import { CATEGORY_IDS } from '../../assessment/index.js';
import './AssessmentResult.css';

// Rendered only once an assessment exists (parent: ArchitectureAnalyzerPage
// mounts this conditionally). Each time a NEW assessment object arrives —
// i.e. the person clicked "Continue to Assessment" again — focus moves to the
// results heading, so keyboard and screen-reader users are taken straight to
// the new result instead of having to go find it (Day 7 a11y requirement:
// focus management after a dynamic update).
function AssessmentResult({ assessment, recommendations = [] }) {
  const { t } = useTranslation();
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [assessment]);

  const rulesByCategory = (categoryId) => assessment.appliedRules.filter((r) => r.category === categoryId);

  return (
    <section className="stack stack--lg assessment-result" aria-labelledby="assessment-result-heading">
      {/* Built directly (not via <SectionHeader>) so the heading element itself —
          not a nested span — can take the ref/tabIndex for focus management. */}
      <div className="section-header section-header--page">
        <div className="section-header__text">
          <h2
            id="assessment-result-heading"
            ref={headingRef}
            tabIndex={-1}
            className="section-header__title"
          >
            {t('assessment.title')}
          </h2>
        </div>
        <div className="section-header__actions">
          <Badge tone="info">{t('common.sampleData')}</Badge>
        </div>
      </div>

      <Card padding="sm">
        <p className="assessment-result__disclaimer">{t('assessment.disclaimer')}</p>
      </Card>

      <Card className="stack stack--sm">
        <h3 className="assessment-result__overall-heading">{t('assessment.overallScore')}</h3>
        <ScoreGauge score={assessment.overallScore} ratingKey={assessment.overallRating} />
      </Card>

      <div className="assessment-categories-grid">
        {CATEGORY_IDS.map((categoryId) => (
          <CategoryScoreCard
            key={categoryId}
            categoryId={categoryId}
            score={assessment.categoryScores[categoryId]}
            ratingKey={assessment.categoryRatings[categoryId]}
            rules={rulesByCategory(categoryId)}
          />
        ))}
      </div>

      <section className="stack stack--sm" aria-labelledby="recommendations-heading">
        <h3 id="recommendations-heading" className="assessment-result__overall-heading">
          {t('recommendations.title')}
        </h3>
        <p className="assessment-result__disclaimer">{t('recommendations.disclaimer')}</p>
        <RecommendationList recommendations={recommendations} />
      </section>
    </section>
  );
}

export default AssessmentResult;
