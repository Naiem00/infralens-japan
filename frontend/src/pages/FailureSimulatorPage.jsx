import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, SectionHeader } from '../components/ui/index.js';
import {
  FAILURE_SCENARIO_IDS,
  simulateFailure,
} from '../failureSimulation/index.js';
import './FailureSimulatorPage.css';

function severityTone(severity) {
  if (severity === 'critical') return 'error';
  if (severity === 'high') return 'error';
  if (severity === 'medium') return 'warning';
  return 'success';
}

function FailureSimulatorPage() {
  const { t } = useTranslation();
  const [scenarioId, setScenarioId] = useState('ec2InstanceFailure');
  const [result, setResult] = useState(null);

  const demoArchitecture = {
    selectedServices: ['ec2', 'ecsFargate', 'rdsPostgres'],
    architectureConfig: {
      ec2: {
        instanceCount: 1,
        autoScalingEnabled: false,
        multiAZ: false,
      },
      ecsFargate: {
        taskCount: 2,
        autoScalingEnabled: false,
        multiAZ: false,
      },
      rdsPostgres: {
        multiAZ: false,
        backupsEnabled: true,
      },
    },
  };

  const handleRun = () => {
    setResult(
      simulateFailure({
        scenarioId,
        ...demoArchitecture,
      })
    );
  };

  return (
    <div className="stack stack--lg">
      <SectionHeader
        level={1}
        title={t('failureSimulator.title')}
        description={t('failureSimulator.description')}
      />

      <Card padding="sm">
        <p>
          <Badge tone="info">{t('common.sampleData')}</Badge>{' '}
          {t('failureSimulator.demoNotice')}
        </p>
      </Card>

      <Card className="stack stack--sm">
        <label htmlFor="failure-scenario">
          {t('failureSimulator.scenarioLabel')}
        </label>

        <select
          id="failure-scenario"
          value={scenarioId}
          onChange={(event) => {
            setScenarioId(event.target.value);
            setResult(null);
          }}
        >
          {FAILURE_SCENARIO_IDS.map((id) => (
            <option key={id} value={id}>
              {t(`failureSimulator.scenarios.${id}`)}
            </option>
          ))}
        </select>

        <Button onClick={handleRun}>
          {t('failureSimulator.run')}
        </Button>
      </Card>

      {result && (
        <Card className="stack stack--sm">
          <div className="failure-result__header">
            <h2>{t('failureSimulator.resultTitle')}</h2>
            <Badge tone={severityTone(result.severity)}>
              {t(`failureSimulator.severity.${result.severity}`)}
            </Badge>
          </div>

          <div>
            <strong>{t('failureSimulator.affectedServices')}</strong>
            <div className="failure-result__services">
              {result.affectedServices.length > 0 ? (
                result.affectedServices.map((serviceId) => (
                  <Badge key={serviceId} tone="neutral">
                    {t(`awsServices.${serviceId}.name`)}
                  </Badge>
                ))
              ) : (
                <span>{t('failureSimulator.noneAffected')}</span>
              )}
            </div>
          </div>

          <div>
            <strong>{t('failureSimulator.impact')}</strong>
            <p>{t(result.impactKey)}</p>
          </div>

          <div>
            <strong>{t('failureSimulator.resilience')}</strong>
            <p>{t(result.resilienceKey)}</p>
          </div>
        </Card>
      )}
    </div>
  );
}

export default FailureSimulatorPage;
