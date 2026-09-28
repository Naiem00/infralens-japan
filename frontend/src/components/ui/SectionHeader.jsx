import { classNames } from '../../utils/classNames.js';
import './SectionHeader.css';

// `level` picks the real heading element (h1-h4) so the page outline stays correct;
// visual size follows the level, not the other way around.
function SectionHeader({ title, description, actions, level = 2, className }) {
  const Heading = `h${level}`;

  return (
    <div className={classNames('section-header', level === 1 && 'section-header--page', className)}>
      <div className="section-header__text">
        <Heading className="section-header__title">{title}</Heading>
        {description && <p className="section-header__description">{description}</p>}
      </div>
      {actions && <div className="section-header__actions">{actions}</div>}
    </div>
  );
}

export default SectionHeader;
