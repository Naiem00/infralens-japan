import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ArchitectureAnalyzerPage from './pages/ArchitectureAnalyzerPage.jsx';
import FailureSimulatorPage from './pages/FailureSimulatorPage.jsx';
import ServiceComparePage from './pages/ServiceComparePage.jsx';
import CostCalculatorPage from './pages/CostCalculatorPage.jsx';
import ProductionReadinessPage from './pages/ProductionReadinessPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Route placeholders for every planned feature area (see project roadmap).
// Pages currently render "planned" content only — no real UI yet.
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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
