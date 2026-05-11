import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DesignerProvider } from './context/DesignerContext';
import DesignSystemPage from './pages/DesignSystemPage';
import DesignerPage from './pages/DesignerPage';
import TrustCenterPage from './pages/TrustCenterPage';

export default function App() {
  const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

  return (
    <DesignerProvider>
      {/* Fill #root so designer shell `h-full` / flex-1 height resolves end-to-end */}
      <div className="h-full min-h-0">
        <BrowserRouter basename={routerBasename}>
          <Routes>
            <Route path="/designerstaging" element={<DesignerPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/trust-center" element={<TrustCenterPage />} />
            <Route path="*" element={<Navigate to="/designerstaging" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </DesignerProvider>
  );
}
