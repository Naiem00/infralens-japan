import { useTranslation } from 'react-i18next';
import { classNames } from '../../utils/classNames.js';
import './ServiceCard.css';

// A single AWS service as a toggle button. Real <button aria-pressed> — not a
// styled <div onClick>, so it's keyboard-operable (Tab + Space/Enter) and its
// pressed state is announced by screen readers for free.
//
// Selected state is shown three ways at once, so nothing depends on color:
// a checkmark glyph, a visibly thicker/accent border, and (for assistive tech)
// a visually-hidden "(Selected)" suffix on the accessible name.
function ServiceCard({ serviceId, selected, onToggle }) {
  const { t } = useTranslation();
  const name = t(`awsServices.${serviceId}.name`);
  const description = t(`awsServices.${serviceId}.description`);

  return (
    <button
      type="button"
      className={classNames('service-card', selected && 'is-selected')}
      aria-pressed={selected}
      onClick={() => onToggle(serviceId)}
    >
      <span className="service-card__status" aria-hidden="true">
        {selected ? '✓' : ''}
      </span>
      <span className="service-card__body">
        <span className="service-card__name">
          {name}
          {selected && <span className="visually-hidden"> ({t('common.selected')})</span>}
        </span>
        <span className="service-card__description">{description}</span>
      </span>
    </button>
  );
}

export default ServiceCard;
