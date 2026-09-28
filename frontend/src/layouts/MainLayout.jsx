import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

// Shared shell for every route: top navigation + main content area.
// This is the "base layout" — it does not yet include the full design
// system (sidebar, theming, etc.), which arrives in Day 3.
function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
