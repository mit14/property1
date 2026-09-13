import { Building2, Plus } from 'lucide-react';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { provinceName } from '@/lib/canadian-provinces';

interface HeaderProps {
  onAddPropertyClick: () => void;
  onSignInClick: () => void;
}

export function Header({ onAddPropertyClick, onSignInClick }: HeaderProps) {
  const { isDemoMode, profile } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
            <Building2 className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-900 leading-none tracking-tight">
              PropLedger
            </h1>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {isDemoMode
                ? 'Demo Mode — Sign in to save data'
                : `Canadian Rental Tracker · ${provinceName(profile?.tax_province ?? 'ON')}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddPropertyClick}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Property</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">2026 Tax Year</span>
          </div>
          <ProfileMenu onSignInClick={onSignInClick} />
        </div>
      </div>
    </header>
  );
}
