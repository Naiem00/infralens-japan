import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, SectionHeader } from '../ui/index.js';
import { AWS_SERVICES } from '../../data/awsServices.js';
import './ArchitectureSummary.css';

function formatFieldValue(t, field, value) {
  if (field.type === 'boolean') {
    return value ? t('common.yes') : t('common.no');
  }
  if (field.type === 'select') {
    const option = field.options.find((o) => o.value === value);
    return option ? t(option.labelKey) : value;
  }
  return String(value);
}

// Configuration Preview only — this is explicitly NOT an assessment result.
// No score, no recommendations; just a readable echo of the current selection
// and field values, plus whether the (very small, Day 6) validation passes.
function ArchitectureSummary({ selectedServices, architectureConfig, validation, submitted, onContinue }) {
  const { t } = useTranslation();

  const selectedServiceObjs = AWS_SERVICES.filter((s) => selectedServices.includes(s.id));
  const configurableSelected = selectedServiceObjs.filter((s) => s.configSchema.length > 0);
  const hasFieldErrors = Object.keys(validation.fieldErrors).length > 0;

  let statusKey = 'ready';
  if (!validation.computeServiceSelected) statusKey = 'computeRequired';
  else if (hasFieldErrors) statusKey = 'fixErrors';

  return (
    <Card className="stack stack--sm architecture-summary">
      <SectionHeader level={2} title={t('architectureAnalyzer.sections.preview')} />

      {selectedServiceObjs.length === 0 ? (
        <p className="architecture-summary__empty">{t('architectureAnalyzer.preview.noSelection')}</p>
      ) : (
        <>
          <div>
            <h3 className="architecture-summary__subheading">
              {t('architectureAnalyzer.preview.selectedServicesHeading')}
            </h3>
            <ul className="architecture-summary__chips">
              {selectedServiceObjs.map((s) => (
                <li key={s.id}>
                  <Badge>{t(`awsServices.${s.id}.name`)}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="architecture-summary__subheading">
              {t('architectureAnalyzer.preview.configurationHeading')}
            </h3>
            {configurableSelected.length === 0 ? (
              <p className="architecture-summary__empty">{t('architectureAnalyzer.configuration.none')}</p>
            ) : (
              <dl className="architecture-summary__config-list">
                {configurableSelected.map((s) =>
                  s.configSchema.map((field) => (
                    <div key={`${s.id}-${field.key}`} className="architecture-summary__config-row">
                      <dt>
                        {t(`awsServices.${s.id}.name`)} — {t(`architectureAnalyzer.fields.${field.key}`)}
                      </dt>
                      <dd>{formatFieldValue(t, field, architectureConfig[s.id]?.[field.key])}</dd>
                    </div>
                  ))
                )}
              </dl>
            )}
          </div>
        </>
      )}

      {/* aria-live: the validation message updates as the person selects services/edits
          fields, and screen-reader users should hear that update without moving focus. */}
      <p className="architecture-summary__status" role="status" aria-live="polite">
        <Badge tone={statusKey === 'ready' ? 'success' : 'warning'}>
          {t(`architectureAnalyzer.validation.${statusKey}`)}
        </Badge>
      </p>

      <Button disabled={!validation.isValid} onClick={onContinue}>
        {t('architectureAnalyzer.buttons.continue')}
      </Button>

      {submitted && (
        <Card padding="sm" className="architecture-summary__submitted">
          <p>{t('architectureAnalyzer.afterSubmit.readyMessage')}</p>
        </Card>
      )}
    </Card>
  );
}

export default ArchitectureSummary;
