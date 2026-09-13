import { useState } from 'react';
import { LayoutDashboard, Home, Plane, FileText } from 'lucide-react';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { BottomNav, type TabKey } from '@/components/BottomNav';
import { ExpenseDrawer } from '@/components/ExpenseDrawer';
import { AuthModal } from '@/components/AuthModal';
import { AddPropertyModal } from '@/components/AddPropertyModal';
import { DashboardView } from '@/components/views/DashboardView';
import { LTRView } from '@/components/views/LTRView';
import { STRView } from '@/components/views/STRView';
import { ReportView } from '@/components/views/ReportView';

const desktopTabs: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'ltr', label: 'Long-Term Rentals', icon: Home },
  { key: 'str', label: 'Airbnb / STR', icon: Plane },
  { key: 'report', label: 'T776 Report', icon: FileText },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        onAddPropertyClick={() => setAddPropertyOpen(true)}
        onSignInClick={() => setAuthOpen(true)}
      />

      {/* Desktop tab bar */}
      <div className="hidden md:block sticky top-[57px] z-30 bg-[#F8FAFC]/80 backdrop-blur-xl border-b border-zinc-200/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-1 py-2">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-28 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            selectedProperty={selectedProperty}
            onPropertyChange={setSelectedProperty}
            onAddPropertyClick={() => setAddPropertyOpen(true)}
          />
        )}
        {activeTab === 'ltr' && <LTRView />}
        {activeTab === 'str' && <STRView />}
        {activeTab === 'report' && <ReportView />}
      </main>

      {/* Floating Add Expense + Drawer */}
      <ExpenseDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      {/* Auth Modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      {/* Add Property Modal */}
      <AddPropertyModal open={addPropertyOpen} onOpenChange={setAddPropertyOpen} />

      {/* Mobile bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
