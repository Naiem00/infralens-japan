// Joins class names, skipping falsy values: classNames('a', cond && 'b') -> 'a b'
export function classNames(...parts) {
  return parts.filter(Boolean).join(' ');
}
