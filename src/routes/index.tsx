// routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* Add other routes */}
    </Routes>
  );
}