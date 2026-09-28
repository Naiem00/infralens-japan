import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ArchitectureAnalyzerPage from './pages/ArchitectureAnalyzerPage.jsx';
import FailureSimulatorPage from './pages/FailureSimulatorPage.jsx';
import ServiceComparePage from './pages/ServiceComparePage.jsx';
import CostCalculatorPage from './pages/CostCalculatorPage.jsx';
import ProductionReadinessPage from './pages/ProductionReadinessPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Dev-only style guide. In production builds import.meta.env.DEV is false, so this is
// null, the dynamic import is dead code that gets removed, and /design-system falls through to 404.
const DesignSystemPage = import.meta.env.DEV
  ? lazy(() => import('./pages/DesignSystemPage.jsx'))
  : null;

// Route placeholders for every planned feature area (see project roadmap).
// The Day 2 routes are unchanged.
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="analyzer" element={<ArchitectureAnalyzerPage />} />
        <Route path="failure-simulator" element={<FailureSimulatorPage />} />
        <Route path="compare" element={<ServiceComparePage />} />
        <Route path="cost-calculator" element={<CostCalculatorPage />} />
        <Route path="readiness" element={<ProductionReadinessPage />} />
        {DesignSystemPage && (
          <Route
            path="design-system"
            element={
              <Suspense fallback={null}>
                <DesignSystemPage />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
