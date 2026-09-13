import { useState, useEffect } from 'react';
import {
  User as UserIcon,
  MapPin,
  LogOut,
  ChevronDown,
  Settings,
  Loader2,
  Moon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CANADIAN_PROVINCES, provinceName } from '@/lib/canadian-provinces';

interface ProfileMenuProps {
  onSignInClick: () => void;
}

export function ProfileMenu({ onSignInClick }: ProfileMenuProps) {
  const { user, profile, isDemoMode, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editProvince, setEditProvince] = useState('ON');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name);
      setEditProvince(profile.tax_province);
    }
  }, [profile]);

  const handleClick = () => {
    if (isDemoMode) {
      onSignInClick();
    } else {
      setMenuOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    toast({ title: 'Signed out', description: 'You are now in demo mode' });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ full_name: editName, tax_province: editProvince });
    setSaving(false);
    setEditOpen(false);
    toast({ title: 'Profile updated' });
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'G';

  return (
    <>
      <button onClick={handleClick} className="flex items-center gap-2 group cursor-pointer">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
          isDemoMode
            ? 'bg-white/10 text-zinc-400 group-hover:bg-white/20'
            : 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white'
        }`}>
          <span className="text-xs font-semibold">{isDemoMode ? 'G' : initials}</span>
        </div>
        {!isDemoMode && (
          <ChevronDown className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors hidden sm:block" />
        )}
      </button>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="max-w-sm bg-[#121317] border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                <span className="text-sm font-semibold">{initials}</span>
              </div>
              <div>
                <p className="text-base font-semibold text-white">{profile?.full_name ?? 'User'}</p>
                <p className="text-xs text-zinc-500 font-normal">{user?.email}</p>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">Profile details</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="rounded-lg bg-white/5 p-3 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <UserIcon className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-sm text-zinc-300">{profile?.full_name ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                <span className="text-sm text-zinc-300">
                  {provinceName(profile?.tax_province ?? 'ON')}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start bg-[#1a1b20] border-white/5 text-zinc-300 hover:text-white hover:bg-white/5"
              onClick={() => setEditOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-rose-400 hover:text-rose-300 bg-[#1a1b20] border-white/5 hover:bg-rose-500/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm bg-[#121317] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-zinc-500">Update your name and tax province</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-zinc-500">Full Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Tax Province</Label>
              <Select value={editProvince} onValueChange={setEditProvince}>
                <SelectTrigger className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1b20] border-white/10">
                  {CANADIAN_PROVINCES.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.name} ({p.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
