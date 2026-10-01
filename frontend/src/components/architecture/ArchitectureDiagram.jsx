import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { buildArchitectureView } from '../../visualization/index.js';
import './ArchitectureDiagram.css';

function ServiceNode({ service }) {
  const { t } = useTranslation();

  return (
    <div className="architecture-diagram__node">
      <strong>{t(`awsServices.${service.id}.name`)}</strong>

      {service.annotations.length > 0 && (
        <div className="architecture-diagram__badges">
          {service.annotations.map((annotation) => (
            <span key={annotation} className="architecture-diagram__badge">
              {annotation}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchitectureDiagram({ selectedServices, architectureConfig }) {
  const { t } = useTranslation();

  const view = useMemo(
    () => buildArchitectureView({ selectedServices, architectureConfig }),
    [selectedServices, architectureConfig]
  );

  if (!view.hasSelection) {
    return (
      <section className="architecture-diagram stack stack--sm">
        <h2>{t('visualization.title')}</h2>
        <p className="architecture-diagram__empty">{t('visualization.empty')}</p>
      </section>
    );
  }

  return (
    <section
      className="architecture-diagram stack stack--sm"
      aria-labelledby="architecture-diagram-heading"
    >
      <div>
        <h2 id="architecture-diagram-heading">{t('visualization.title')}</h2>
        <p>{t('visualization.description')}</p>
      </div>

      {view.vpcSelected && (
        <div className="architecture-diagram__vpc">
          {t('visualization.vpcContext')}
        </div>
      )}

      <div className="architecture-diagram__flow">
        <div className="architecture-diagram__lane">
          <span className="architecture-diagram__lane-title">
            {t('visualization.lanes.user')}
          </span>
          <div className="architecture-diagram__node architecture-diagram__node--concept">
            {t('visualization.userInternet')}
          </div>
        </div>

        {view.lanes.map((lane) => (
          <div className="architecture-diagram__step" key={lane.id}>
            <span className="architecture-diagram__arrow" aria-hidden="true">
              →
            </span>

            <div className="architecture-diagram__lane">
              <span className="architecture-diagram__lane-title">
                {t(`visualization.lanes.${lane.id}`)}
              </span>

              <div className="architecture-diagram__nodes">
                {lane.services.map((service) => (
                  <ServiceNode key={service.id} service={service} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {view.supportingServices.length > 0 && (
        <div className="architecture-diagram__support">
          <h3>{t('visualization.supporting')}</h3>

          <div className="architecture-diagram__nodes">
            {view.supportingServices.map((service) => (
              <ServiceNode key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ArchitectureDiagram;
