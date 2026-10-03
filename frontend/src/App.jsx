import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ArchitectureAnalyzerPage = lazy(() => import('./pages/ArchitectureAnalyzerPage.jsx'));
const FailureSimulatorPage = lazy(() => import('./pages/FailureSimulatorPage.jsx'));
const ServiceComparePage = lazy(() => import('./pages/ServiceComparePage.jsx'));
const CostCalculatorPage = lazy(() => import('./pages/CostCalculatorPage.jsx'));
const ProductionReadinessPage = lazy(() => import('./pages/ProductionReadinessPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

const DesignSystemPage = import.meta.env.DEV
  ? lazy(() => import('./pages/DesignSystemPage.jsx'))
  : null;

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="analyzer" element={<ArchitectureAnalyzerPage />} />
          <Route path="failure-simulator" element={<FailureSimulatorPage />} />
          <Route path="compare" element={<ServiceComparePage />} />
          <Route path="cost-calculator" element={<CostCalculatorPage />} />
          <Route path="readiness" element={<ProductionReadinessPage />} />

          {DesignSystemPage && (
            <Route path="design-system" element={<DesignSystemPage />} />
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
