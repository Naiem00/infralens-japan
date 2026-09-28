import Card from './Card.jsx';
import { classNames } from '../../utils/classNames.js';
import './StatCard.css';

// A single metric. Rendered as a <dl> (term = label, description = value) so
// assistive tech announces "label: value". `badge` is an optional slot, e.g. a "Sample Data" tag.
function StatCard({ label, value, helper, badge, className }) {
  return (
    <Card as="dl" className={classNames('stat-card', className)}>
      <dt className="stat-card__label">{label}</dt>
      <dd className="stat-card__value">{value}</dd>
      {helper && <dd className="stat-card__helper">{helper}</dd>}
      {badge && <dd className="stat-card__badge">{badge}</dd>}
    </Card>
  );
}

export default StatCard;
