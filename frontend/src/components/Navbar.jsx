import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import PageContainer from './ui/PageContainer.jsx';
import { classNames } from '../utils/classNames.js';
import './Navbar.css';

// Route -> translation key. Order here is the visual nav order.
const navItems = [
  { to: '/', labelKey: 'nav.dashboard', end: true },
  { to: '/analyzer', labelKey: 'nav.analyzer' },
  { to: '/failure-simulator', labelKey: 'nav.failureSimulator' },
  { to: '/compare', labelKey: 'nav.serviceCompare' },
  { to: '/cost-calculator', labelKey: 'nav.costCalculator' },
  { to: '/readiness', labelKey: 'nav.productionReadiness' },
];

function MenuIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {open ? (
        <>
          <path d="M5 5l10 10" />
          <path d="M15 5L5 15" />
        </>
      ) : (
        <>
          <path d="M3 5h14" />
          <path d="M3 10h14" />
          <path d="M3 15h14" />
        </>
      )}
    </svg>
  );
}

function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

  // Escape closes the mobile menu and returns focus to the button that opened it.
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <header className="site-header" onKeyDown={handleKeyDown}>
      <PageContainer className="site-header__inner">
        <Link to="/" className="site-header__brand" onClick={closeMenu}>
          {t('brand.name')} <span className="site-header__brand-region">{t('brand.region')}</span>
        </Link>

        <div className="site-header__controls">
          <LanguageSwitcher />

          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={isOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            <MenuIcon open={isOpen} />
            <span>{t('nav.menu')}</span>
          </button>
        </div>

        <nav
          id="primary-navigation"
          className={classNames('site-nav', isOpen && 'is-open')}
          aria-label={t('nav.primaryLabel')}
        >
          <ul className="site-nav__list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={closeMenu}
                  className={({ isActive }) => classNames('site-nav__link', isActive && 'is-active')}
                >
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </PageContainer>
    </header>
  );
}

export default Navbar;
