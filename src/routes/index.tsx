// routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Invest from '../pages/Invest/Invest';
import NotFound from './404';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/invest" element={<Invest />} />
      <Route path="/*" element={<NotFound />} />
      {/* Add other routes */}
    </Routes>
  );
}