import { Building2, Plus, Moon } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[#0a0b0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
            <Building2 className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white leading-none tracking-tight">
              PropLedger
            </h1>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {isDemoMode
                ? 'Demo Mode'
                : `${provinceName(profile?.tax_province ?? 'ON')} · 2026`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onAddPropertyClick}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600/10 border border-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Add</span>
          </button>
          <ProfileMenu onSignInClick={onSignInClick} />
        </div>
      </div>
    </header>
  );
}
