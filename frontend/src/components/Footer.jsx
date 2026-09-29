import { useTranslation } from 'react-i18next';
import PageContainer from './ui/PageContainer.jsx';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <PageContainer className="site-footer__inner">
        <p>{t('footer.copyright')}</p>
        <p>{t('footer.disclaimer')}</p>
      </PageContainer>
    </footer>
  );
}

export default Footer;
