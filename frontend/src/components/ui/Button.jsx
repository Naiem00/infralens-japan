import { Link } from 'react-router-dom';
import { classNames } from '../../utils/classNames.js';
import './Button.css';

// Renders a real <button> for actions, or a router <Link> when `to` is given
// (navigation should be a link, not a button — better semantics for keyboards and screen readers).
function Button({ variant = 'primary', size = 'md', to, type = 'button', className, children, ...rest }) {
  const classes = classNames('btn', `btn--${variant}`, `btn--${size}`, className);

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
