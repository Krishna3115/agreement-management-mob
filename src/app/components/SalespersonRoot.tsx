import React from 'react';
import { Outlet } from 'react-router';

// Separate shell for the salesperson app.
// IMPORTANT: this does NOT include the owner's header or bottom nav.
// SalespersonHome renders its own header + its own bottom tab bar,
// so here we just provide a clean full-height container.
export default function SalespersonRoot() {
  return (
    <div className="h-screen bg-slate-50 overflow-y-auto">
      <Outlet />
    </div>
  );
}
