import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArchitectureSummary, ConfigPanel, ServiceSelector } from '../components/architecture/index.js';
import { Badge, Card, SectionHeader } from '../components/ui/index.js';
import { buildDefaultConfig, getServiceById } from '../data/awsServices.js';
import { validateArchitecture } from '../utils/architectureValidation.js';
import './ArchitectureAnalyzerPage.css';

// Day 6: selection + configuration UI only. No scoring, no recommendations —
// see validateArchitecture (utils/architectureValidation.js) for the very small
// amount of "is this a usable Day 6 form" validation, which is NOT the Day 7
// assessment rules engine.
function ArchitectureAnalyzerPage() {
  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = useState([]);
  const [architectureConfig, setArchitectureConfig] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleToggleService = (serviceId) => {
    const wasSelected = selectedServices.includes(serviceId);

    setSelectedServices((prev) =>
      wasSelected ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );

    // Selecting a service for the first time seeds its config with schema
    // defaults; deselecting keeps the config around so re-selecting restores it.
    if (!wasSelected && !architectureConfig[serviceId]) {
      const service = getServiceById(serviceId);
      setArchitectureConfig((prev) => ({ ...prev, [serviceId]: buildDefaultConfig(service) }));
    }

    setSubmitted(false);
  };

  const handleFieldChange = (serviceId, fieldKey, rawValue) => {
    setArchitectureConfig((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldKey]: rawValue },
    }));
    setSubmitted(false);
  };

  const validation = useMemo(
    () => validateArchitecture(selectedServices, architectureConfig),
    [selectedServices, architectureConfig]
  );

  const handleContinue = () => {
    if (validation.isValid) setSubmitted(true);
  };

  return (
    <div className="stack stack--lg">
      <SectionHeader level={1} title={t('architectureAnalyzer.title')} description={t('architectureAnalyzer.description')} />

      <Card padding="sm">
        <p>
          <Badge tone="info">{t('common.sampleData')}</Badge> {t('architectureAnalyzer.demoNotice')}
        </p>
      </Card>

      <section className="stack stack--sm">
        <SectionHeader level={2} title={t('architectureAnalyzer.sections.serviceSelection')} />
        <ServiceSelector selectedServices={selectedServices} onToggleService={handleToggleService} />
      </section>

      <div className="analyzer-layout">
        <section className="stack stack--sm">
          <SectionHeader level={2} title={t('architectureAnalyzer.sections.configuration')} />
          <ConfigPanel
            selectedServices={selectedServices}
            architectureConfig={architectureConfig}
            fieldErrors={validation.fieldErrors}
            onFieldChange={handleFieldChange}
          />
        </section>

        <ArchitectureSummary
          selectedServices={selectedServices}
          architectureConfig={architectureConfig}
          validation={validation}
          submitted={submitted}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}

export default ArchitectureAnalyzerPage;
