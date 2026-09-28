import './SkipLink.css';

// First focusable element on the page: lets keyboard users jump past the navigation.
function SkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
  );
}

export default SkipLink;
