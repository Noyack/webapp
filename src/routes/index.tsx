// routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Invest from '../pages/Invest/Invest';
import NotFound from './404';
import Planning from '../pages/Planning/Planning';
import Community from '../pages/Community/Community';
import Bookmark from '../pages/Bookmark/Bookmark';
import Wealthview from '../pages/Wealthview/Wealthview';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/invest" element={<Invest />} />
      <Route path="/planning" element={<Planning />} />
      <Route path="/community" element={<Community />} />
      <Route path="/bookmark" element={<Bookmark />} />
      <Route path="/wealthview" element={<Wealthview />} />
      <Route path="/*" element={<NotFound />} />
      {/* Add other routes */}
    </Routes>
  );
}