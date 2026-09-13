import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { BottomNav, type TabKey } from '@/components/BottomNav';
import { ExpenseDrawer } from '@/components/ExpenseDrawer';
import { AuthModal } from '@/components/AuthModal';
import { AddPropertyModal } from '@/components/AddPropertyModal';
import { HomeView } from '@/components/views/HomeView';
import { PropertiesView } from '@/components/views/PropertiesView';
import { PropertyDetailView } from '@/components/views/PropertyDetailView';
import { ReportView } from '@/components/views/ReportView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSelectedPropertyId(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <Header
        onAddPropertyClick={() => setAddPropertyOpen(true)}
        onSignInClick={() => setAuthOpen(true)}
      />

      <main className="px-4 py-5 pb-24">
        {selectedPropertyId ? (
          <PropertyDetailView
            propertyId={selectedPropertyId}
            onBack={() => setSelectedPropertyId(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                onNavigate={handleTabChange}
                onPropertyClick={handlePropertyClick}
              />
            )}
            {activeTab === 'properties' && (
              <PropertiesView onPropertyClick={handlePropertyClick} />
            )}
            {activeTab === 'report' && <ReportView />}
            {activeTab === 'profile' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-zinc-500 mb-4">Tap your profile icon in the top-right to manage your account.</p>
              </div>
            )}
          </>
        )}
      </main>

      <ExpenseDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <AddPropertyModal open={addPropertyOpen} onOpenChange={setAddPropertyOpen} />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
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
