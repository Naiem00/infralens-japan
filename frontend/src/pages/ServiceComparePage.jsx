import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Card, SectionHeader } from '../components/ui/index.js';
import {
  COMPARISON_GROUP_IDS,
  getComparisonGroup,
} from '../serviceCompare/index.js';
import './ServiceComparePage.css';

function ServiceComparePage() {
  const { t } = useTranslation();
  const [groupId, setGroupId] = useState('compute');

  const group = getComparisonGroup(groupId);

  return (
    <div className="stack stack--lg">
      <SectionHeader
        level={1}
        title={t('serviceCompare.title')}
        description={t('serviceCompare.description')}
      />

      <Card padding="sm">
        <p>
          <Badge tone="info">{t('common.sampleData')}</Badge>{' '}
          {t('serviceCompare.notice')}
        </p>
      </Card>

      <Card className="stack stack--sm">
        <label htmlFor="comparison-group">
          {t('serviceCompare.groupLabel')}
        </label>

        <select
          id="comparison-group"
          value={groupId}
          onChange={(event) => setGroupId(event.target.value)}
        >
          {COMPARISON_GROUP_IDS.map((id) => (
            <option key={id} value={id}>
              {t(`serviceCompare.groups.${id}`)}
            </option>
          ))}
        </select>
      </Card>

      <div className="service-compare__table-wrapper">
        <table className="service-compare__table">
          <thead>
            <tr>
              <th scope="col">{t('serviceCompare.attribute')}</th>

              {group.serviceIds.map((serviceId) => (
                <th scope="col" key={serviceId}>
                  {t(`awsServices.${serviceId}.name`)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {group.attributes.map((attributeId) => (
              <tr key={attributeId}>
                <th scope="row">
                  {t(`serviceCompare.attributes.${attributeId}`)}
                </th>

                {group.serviceIds.map((serviceId) => (
                  <td key={serviceId}>
                    {t(
                      `serviceCompare.values.${groupId}.${serviceId}.${attributeId}`
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card padding="sm">
        <p>{t(`serviceCompare.summary.${groupId}`)}</p>
      </Card>
    </div>
  );
}

export default ServiceComparePage;
