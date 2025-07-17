// routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect, FC } from 'react';
import { preloadComponent, preloadRoutes } from '../utils/preload';
import { ProtectedRoute } from './ProtectedRoutes';

// Lazy load all page components with preloading
const Account = lazy(() => import('../pages/Account/Account'));
const Dashboard = lazy(preloadComponent(() => import('../pages/Dashboard/Dashboard')));
const EAccount = lazy(() => import('../pages/EAccount/EAccount'));
const Events = lazy(() => import('../pages/Events/Events'));
const Invest = lazy(preloadComponent(() => import('../pages/Invest/Invest')));
const IRAFunding = lazy(preloadComponent(() => import('../pages/IRAFunding/IRAFunding')));
const Wallet = lazy(preloadComponent(() => import('../pages/Wallet/Wallet')));
const Quiz = lazy(preloadComponent(() => import('../pages/Wealthview/WealthIQ')));
const Library = lazy(() => import('../pages/Library/Library'));
const NotFound = lazy(() => import('./404'));
const Planning = lazy(preloadComponent(() => import('../pages/Planning/Planning')));
// const Bookmark = lazy(() => import('../pages/Bookmark/Bookmark'));
const Support = lazy(() => import('../pages/Support/Support'));
const Wealthview = lazy(preloadComponent(() => import('../pages/Wealthview/Wealthview')));

// Loading component
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

// Preload next likely routes when on dashboard
const DashboardWithPreload: FC = () => {
  useEffect(() => {
    // Preload likely next routes when on dashboard
    void preloadRoutes.invest();
    void preloadRoutes.planning();
  }, []);

  return <Dashboard />;
};

// Preload next likely routes when on invest page
const InvestWithPreload: FC = () => {
  useEffect(() => {
    // Preload likely next routes when on invest page
    void preloadRoutes.wealthview();
    void preloadRoutes.planning();
  }, []);

  return <Invest />;
};

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardWithPreload />
          </Suspense>
        } 
      />
      
      <Route 
        path="/invest" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute feature='investor' action='access'>
              <InvestWithPreload />
            </ProtectedRoute>
          </Suspense>
        } 
      />
      <Route 
        path="/account" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute feature='investor' action='access'>
              <EAccount />
            </ProtectedRoute>
          </Suspense>
        } 
      />
      <Route 
        path="/funding" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute feature='investor' action='access'>
              <IRAFunding />
            </ProtectedRoute>'
          </Suspense>
        } 
      />
      <Route 
        path="/wallet" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute feature='investor' action='access'>
            <Wallet />
            </ProtectedRoute>
          </Suspense>
        } 
      />
      <Route 
        path="/quiz" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Quiz />
          </Suspense>
        } 
      />
      <Route 
        path="/tools" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Planning />
          </Suspense>
        } 
      />
      <Route 
        path="/events" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Events />
          </Suspense>
        } 
      />
      <Route 
        path="/library" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Library />
          </Suspense>
        } 
      />
      <Route 
        path="/wealthview" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Wealthview />
          </Suspense>
        } 
      />
      <Route 
        path="/support" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Support />
          </Suspense>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Account />
          </Suspense>
        } 
      />
      <Route 
        path="/*" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;