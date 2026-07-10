import React from 'react';
import { AppProvider } from './AppContext';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-bg-main text-white font-sans">
        <AdminDashboard />
      </div>
    </AppProvider>
  );
}
