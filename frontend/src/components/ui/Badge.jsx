import { classNames } from '../../utils/classNames.js';
import './Badge.css';

// Each tone also gets a symbol, so meaning never depends on color alone.
// The symbol is decorative (aria-hidden); the text label carries the meaning.
const TONE_SYMBOLS = {
  neutral: null,
  info: 'i',
  success: '✓',
  warning: '!',
  error: '✕',
};

function Badge({ tone = 'neutral', className, children }) {
  const symbol = TONE_SYMBOLS[tone];

  return (
    <span className={classNames('badge', `badge--${tone}`, className)}>
      {symbol && (
        <span className="badge__symbol" aria-hidden="true">
          {symbol}
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
