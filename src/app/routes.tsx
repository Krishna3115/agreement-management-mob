import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Root from './components/Root';
import SalespersonRoot from './components/SalespersonRoot';
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



// ─── Field Sales / Invoice module pages ────────────────────────────
import SalespersonHome from './pages/field/SalespersonHome';
import ManageSalespeople from './pages/field/ManageSalespeople';
import ManageContainers from './pages/field/ManageContainers';
import FieldReports from './pages/field/FieldReports';

import AdminfieldOps from './pages/AdminfieldOps';
// ─── Auth Guard ─────────────────────────────────────────────────────
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// ─── Owner-only shell guard ─────────────────────────────────────────
// If a salesperson somehow lands on the owner area, push them to their app.
function OwnerArea({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const role = localStorage.getItem('user_role');
  if (role === 'SALESPERSON') return <Navigate to="/field/sales" replace />;
  return <>{children}</>;
}

// ─── Salesperson-area guard ─────────────────────────────────────────
// Owners can still open it if they navigate manually, but unauthenticated
// users are bounced to login.
function SalesArea({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },

  // ════════════════════════════════════════════════════════════
  // OWNER AREA — wrapped in the owner Root (header + owner bottom nav)
  // ════════════════════════════════════════════════════════════
  {
    path: '/',
    element: (
      <OwnerArea>
        <Root />
      </OwnerArea>
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

      // Owner-only field management pages (live inside owner shell)
      { path: 'field/salespeople', Component: ManageSalespeople },
      { path: 'field/containers',  Component: ManageContainers },
      { path: 'field/reports',     Component: FieldReports },
     // { path: 'field/admin',       Component: AdminfieldOps },
      { path: 'field/operations', Component: AdminfieldOps },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // SALESPERSON AREA — completely separate shell, NO owner navbar
  // ════════════════════════════════════════════════════════════
  {
    path: '/field',
    element: (
      <SalesArea>
        <SalespersonRoot />
      </SalesArea>
    ),
    children: [
      { path: 'sales', Component: SalespersonHome },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
