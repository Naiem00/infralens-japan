import { NavLink } from 'react-router-dom';

// Centralized list of nav destinations so links stay in sync with App.jsx
// routes. Labels are plain English strings for now — Day 4 replaces these
// with i18next translation keys (e.g. nav.dashboard, nav.analyzer).
const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/analyzer', label: 'Architecture Analyzer' },
  { to: '/failure-simulator', label: 'Failure Simulator' },
  { to: '/compare', label: 'Service Compare' },
  { to: '/cost-calculator', label: 'Cost Calculator' },
  { to: '/readiness', label: 'Production Readiness' },
];

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">InfraLens Japan</div>
      <nav className="navbar-links" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
