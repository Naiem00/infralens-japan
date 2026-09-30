import { useTranslation } from 'react-i18next';
import ConfigField from './ConfigField.jsx';
import { Card, SectionHeader } from '../ui/index.js';
import { AWS_SERVICES } from '../../data/awsServices.js';
import './ConfigPanel.css';

// One Card per SELECTED service that actually has configSchema entries.
// Services with no config (DynamoDB, VPC, SNS, ...) are intentionally skipped
// here — they still appear in the service grid and the summary, just with
// nothing to configure (Day 6 spec: "focused set", not every possible setting).
function ConfigPanel({ selectedServices, architectureConfig, fieldErrors, onFieldChange }) {
  const { t } = useTranslation();

  const configurableServices = AWS_SERVICES.filter(
    (s) => selectedServices.includes(s.id) && s.configSchema.length > 0
  );

  if (configurableServices.length === 0) {
    return (
      <Card>
        <p className="config-panel__empty">{t('architectureAnalyzer.configuration.none')}</p>
      </Card>
    );
  }

  return (
    <div className="stack stack--sm">
      {configurableServices.map((service) => (
        <Card key={service.id} className="stack stack--sm">
          <SectionHeader level={3} title={t(`awsServices.${service.id}.name`)} />
          <div className="config-panel__fields">
            {service.configSchema.map((field) => (
              <ConfigField
                key={field.key}
                field={field}
                serviceId={service.id}
                value={architectureConfig[service.id]?.[field.key]}
                errorKey={fieldErrors[service.id]?.[field.key]}
                onChange={onFieldChange}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ConfigPanel;
