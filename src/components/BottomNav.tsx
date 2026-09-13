import { LayoutDashboard, Home, Plane, FileText } from 'lucide-react';

export type TabKey = 'dashboard' | 'ltr' | 'str' | 'report';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'ltr', label: 'Rentals', icon: Home },
  { key: 'str', label: 'Airbnb', icon: Plane },
  { key: 'report', label: 'T776', icon: FileText },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-zinc-200/80 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-5xl mx-auto flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-3 min-w-[64px] transition-colors ${
                isActive ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-emerald-600' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-8 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
