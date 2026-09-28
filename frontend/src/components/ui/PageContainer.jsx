import { classNames } from '../../utils/classNames.js';
import './PageContainer.css';

// Centers content and applies the shared max-width + responsive gutter.
// Used by the header, main content and footer so everything lines up.
function PageContainer({ as: Component = 'div', size = 'default', className, children, ...rest }) {
  return (
    <Component
      className={classNames('page-container', size === 'narrow' && 'page-container--narrow', className)}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default PageContainer;
