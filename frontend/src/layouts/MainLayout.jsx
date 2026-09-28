import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import SkipLink from '../components/SkipLink.jsx';
import { PageContainer } from '../components/ui/index.js';

// Responsive application shell shared by every route:
// skip link -> header/navigation -> <main> (routed page) -> footer.
function MainLayout() {
  return (
    <div className="app-shell">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
