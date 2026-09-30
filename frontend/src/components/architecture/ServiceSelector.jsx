import { useTranslation } from 'react-i18next';
import ServiceCard from './ServiceCard.jsx';
import { SectionHeader } from '../ui/index.js';
import { AWS_SERVICES, CATEGORIES } from '../../data/awsServices.js';
import './ServiceSelector.css';

// Renders every AWS_SERVICES entry grouped under its category, in the fixed
// category order from data/awsServices.js. Purely a renderer over that data —
// adding a service later means editing the data file, not this component.
function ServiceSelector({ selectedServices, onToggleService }) {
  const { t } = useTranslation();

  return (
    <div className="stack stack--lg">
      {CATEGORIES.map((category) => {
        const services = AWS_SERVICES.filter((s) => s.categoryId === category.id);
        return (
          <div key={category.id} className="stack stack--sm">
            <SectionHeader level={3} title={t(category.labelKey)} />
            <div className="service-grid">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  serviceId={service.id}
                  selected={selectedServices.includes(service.id)}
                  onToggle={onToggleService}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ServiceSelector;
