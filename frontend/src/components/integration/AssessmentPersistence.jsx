import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui/index.js';
import { saveAssessment } from '../../api/index.js';

function AssessmentPersistence({
  selectedServices,
  architectureConfig,
  assessment,
  recommendations,
}) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('idle');
  const [savedId, setSavedId] = useState(null);

  if (!assessment) {
    return null;
  }

  const handleSave = async () => {
    try {
      setStatus('saving');

      const result = await saveAssessment({
        architecture: {
          name: 'Architecture Analyzer Result',
          selectedServices,
          config: architectureConfig,
        },
        assessment: {
          overallScore: assessment.overallScore,
          categoryScores: assessment.categoryScores,
          appliedRules: assessment.appliedRules,
        },
        recommendations:
          recommendations || [],
      });

      setSavedId(result.id);
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <Card className="stack stack--sm">
      <h2>{t('integration.saveTitle')}</h2>

      <p>{t('integration.saveDescription')}</p>

      <Button
        type="button"
        onClick={handleSave}
        disabled={status === 'saving'}
      >
        {status === 'saving'
          ? t('integration.saving')
          : t('integration.saveButton')}
      </Button>

      {status === 'saved' && (
        <p role="status">
          {t('integration.saved', {
            id: savedId,
          })}
        </p>
      )}

      {status === 'error' && (
        <p role="alert">
          {t('integration.error')}
        </p>
      )}
    </Card>
  );
}

export default AssessmentPersistence;
