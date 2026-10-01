import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Card, SectionHeader } from '../components/ui/index.js';
import { calculateSampleCost } from '../costCalculator/index.js';
import './CostCalculatorPage.css';

function CostCalculatorPage() {
  const { t } = useTranslation();

  const [input, setInput] = useState({
    ec2Instances: 2,
    rdsInstances: 1,
    s3StorageGb: 100,
    cloudfrontTransferGb: 200,
  });

  const result = useMemo(
    () => calculateSampleCost(input),
    [input]
  );

  const updateField = (key, value) => {
    setInput((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const formatJPY = (value) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="stack stack--lg">
      <SectionHeader
        level={1}
        title={t('costCalculator.title')}
        description={t('costCalculator.description')}
      />

      <Card padding="sm">
        <p>
          <Badge tone="warning">
            {t('costCalculator.sampleEstimate')}
          </Badge>{' '}
          {t('costCalculator.notice')}
        </p>
      </Card>

      <div className="cost-calculator__layout">
        <Card className="stack stack--sm">
          <h2>{t('costCalculator.inputsTitle')}</h2>

          <label>
            {t('costCalculator.fields.ec2Instances')}
            <input
              type="number"
              min="0"
              value={input.ec2Instances}
              onChange={(event) =>
                updateField('ec2Instances', event.target.value)
              }
            />
          </label>

          <label>
            {t('costCalculator.fields.rdsInstances')}
            <input
              type="number"
              min="0"
              value={input.rdsInstances}
              onChange={(event) =>
                updateField('rdsInstances', event.target.value)
              }
            />
          </label>

          <label>
            {t('costCalculator.fields.s3StorageGb')}
            <input
              type="number"
              min="0"
              value={input.s3StorageGb}
              onChange={(event) =>
                updateField('s3StorageGb', event.target.value)
              }
            />
          </label>

          <label>
            {t('costCalculator.fields.cloudfrontTransferGb')}
            <input
              type="number"
              min="0"
              value={input.cloudfrontTransferGb}
              onChange={(event) =>
                updateField(
                  'cloudfrontTransferGb',
                  event.target.value
                )
              }
            />
          </label>
        </Card>

        <Card className="stack stack--sm">
          <h2>{t('costCalculator.breakdownTitle')}</h2>

          <div className="cost-calculator__row">
            <span>Amazon EC2</span>
            <strong>{formatJPY(result.breakdown.ec2)}</strong>
          </div>

          <div className="cost-calculator__row">
            <span>Amazon RDS</span>
            <strong>{formatJPY(result.breakdown.rds)}</strong>
          </div>

          <div className="cost-calculator__row">
            <span>Amazon S3</span>
            <strong>{formatJPY(result.breakdown.s3)}</strong>
          </div>

          <div className="cost-calculator__row">
            <span>Amazon CloudFront</span>
            <strong>{formatJPY(result.breakdown.cloudfront)}</strong>
          </div>

          <div className="cost-calculator__total">
            <span>{t('costCalculator.total')}</span>
            <strong>{formatJPY(result.total)}</strong>
          </div>
        </Card>
      </div>

      <Card padding="sm">
        <p>{t('costCalculator.footerNotice')}</p>
      </Card>
    </div>
  );
}

export default CostCalculatorPage;
