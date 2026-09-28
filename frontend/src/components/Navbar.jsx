import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PageContainer from './ui/PageContainer.jsx';
import { classNames } from '../utils/classNames.js';
import './Navbar.css';

// Single source of truth for navigation. Labels are plain English for now;
// Day 4 replaces them (and the aria/label strings below) with i18next keys.
const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/analyzer', label: 'Architecture Analyzer' },
  { to: '/failure-simulator', label: 'Failure Simulator' },
  { to: '/compare', label: 'Service Compare' },
  { to: '/cost-calculator', label: 'Cost Calculator' },
  { to: '/readiness', label: 'Production Readiness' },
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
          InfraLens <span className="site-header__brand-region">Japan</span>
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <MenuIcon open={isOpen} />
          <span>Menu</span>
        </button>

        <nav
          id="primary-navigation"
          className={classNames('site-nav', isOpen && 'is-open')}
          aria-label="Primary"
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
                  {item.label}
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
