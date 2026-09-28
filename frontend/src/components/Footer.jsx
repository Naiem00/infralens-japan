import PageContainer from './ui/PageContainer.jsx';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <PageContainer className="site-footer__inner">
        <p>© 2026 Naiem Naimur Rahman</p>
        <p>
          Independent portfolio project. Not affiliated with, endorsed by, or sponsored by Amazon Web
          Services (AWS).
        </p>
      </PageContainer>
    </footer>
  );
}

export default Footer;
