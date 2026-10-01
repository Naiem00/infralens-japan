import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArchitectureSummary, ConfigPanel, ServiceSelector } from '../components/architecture/index.js';
import { AssessmentResult } from '../components/assessment/index.js';
import { Badge, Card, SectionHeader } from '../components/ui/index.js';
import { buildDefaultConfig, getServiceById } from '../data/awsServices.js';
import { validateArchitecture } from '../utils/architectureValidation.js';
import { calculateAssessment } from '../assessment/index.js';
import { generateRecommendations } from '../recommendations/index.js';
import './ArchitectureAnalyzerPage.css';

// Day 6 built selection + configuration. Day 7 adds: clicking Continue on a
// VALID configuration runs the pure, deterministic scoring engine
// (src/assessment/) and renders its result below. Day 8 runs a second pure
// engine (src/recommendations/) and appends advice under that result.
// validateArchitecture (utils/architectureValidation.js) is still only the
// Day 6 form-validity check — it is NOT the scoring engine and never
// influences the score or the recommendations.
function ArchitectureAnalyzerPage() {
  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = useState([]);
  const [architectureConfig, setArchitectureConfig] = useState({});
  const [assessment, setAssessment] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

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

    // Any change to the selection invalidates a previously computed result —
    // the on-screen assessment must always reflect the CURRENT configuration,
    // never a stale snapshot from before the person kept editing.
    setAssessment(null);
    setRecommendations([]);
  };

  const handleFieldChange = (serviceId, fieldKey, rawValue) => {
    setArchitectureConfig((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldKey]: rawValue },
    }));
    setAssessment(null);
    setRecommendations([]);
  };

  const validation = useMemo(
    () => validateArchitecture(selectedServices, architectureConfig),
    [selectedServices, architectureConfig]
  );

  const handleContinue = () => {
    if (!validation.isValid) return;
    // calculateAssessment is pure and synchronous: no network call, no loading
    // state needed. A fresh object is returned even for identical input, which
    // is what re-triggers AssessmentResult's focus-management effect on re-click.
    setAssessment(calculateAssessment({ selectedServices, architectureConfig }));
    setRecommendations(generateRecommendations({ selectedServices, architectureConfig }).recommendations);
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
          submitted={assessment !== null}
          onContinue={handleContinue}
        />
      </div>

      {assessment && <AssessmentResult assessment={assessment} recommendations={recommendations} />}
    </div>
  );
}

export default ArchitectureAnalyzerPage;
