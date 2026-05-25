import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Root from './components/Root';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import QuotationsPage from './pages/QuotationsPage';
import ProposalPage from './pages/ProposalPage';
import AgreementsPage from './pages/AgreementsPage';
import InvoicesPage from './pages/InvoicesPage';
import { useApp } from './context/AppContext';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import MaterialReceivingEntryPage from './pages/MaterialReceivingEntryPage';
import SalesOrderPage from './pages/SalesOrderPage';
import SalesReportListPage from './pages/SalesReportListPage';
import PriceListPage from './pages/PriceListPage';
// ─── Auth Guard ───────────────────────────────────────────────────────────────
// If not authenticated → redirect to /login.
// If authenticated → render the child layout normally.
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    // Public route — accessible without login
    path: '/login',
    Component: LoginPage,
  },
  {
    // All app routes are protected behind RequireAuth
    path: '/',
    element: (
      <RequireAuth>
        <Root />
      </RequireAuth>
    ),
    children: [
      { index: true, Component: DashboardPage },
      { path: 'companies', Component: CompaniesPage },
      { path: 'quotations', Component: QuotationsPage },
      { path: 'proposals', Component: ProposalPage },
      { path: 'agreements', Component: AgreementsPage },
      { path: 'invoices', Component: InvoicesPage },
      { path: 'purchase-orders', Component: PurchaseOrdersPage },
      { path: 'material-receiving', Component: MaterialReceivingEntryPage },
      { path: 'sales-orders', Component: SalesOrderPage },
      { path: 'sales-reports', Component: SalesReportListPage },
      { path: 'price-list', Component: PriceListPage },
    ],
  },
  {
    // Any unknown path → go to login
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);