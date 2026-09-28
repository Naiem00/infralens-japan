import { classNames } from '../../utils/classNames.js';
import './Card.css';

// Generic surface. `as` lets callers pick the right semantic element (div, section, article, dl...).
function Card({ as: Component = 'div', padding = 'md', className, children, ...rest }) {
  return (
    <Component className={classNames('card', `card--${padding}`, className)} {...rest}>
      {children}
    </Component>
  );
}

export default Card;
