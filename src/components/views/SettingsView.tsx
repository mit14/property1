import { useState, useEffect } from 'react';
import {
  User as UserIcon,
  MapPin,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Trash2,
  ChevronRight,
  Loader2,
  Moon,
  Download,
  Mail,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CANADIAN_PROVINCES, provinceName } from '@/lib/canadian-provinces';

interface SettingsViewProps {
  onSignInClick: () => void;
}

export function SettingsView({ onSignInClick }: SettingsViewProps) {
  const { user, profile, isDemoMode, signOut, updateProfile, deleteAccount } = useAuth();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editProvince, setEditProvince] = useState('ON');
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [receiptReminders, setReceiptReminders] = useState(true);
  const [taxAlerts, setTaxAlerts] = useState(true);

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name);
      setEditProvince(profile.tax_province);
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You are now in demo mode' });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ full_name: editName, tax_province: editProvince });
    setSaving(false);
    setEditOpen(false);
    toast({ title: 'Profile updated' });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast({ title: 'Type DELETE to confirm', variant: 'destructive' });
      return;
    }
    setDeleting(true);
    const { error } = await deleteAccount();
    setDeleting(false);
    setDeleteOpen(false);
    if (error) {
      toast({ title: 'Error deleting account', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Account deleted', description: 'All your data has been removed' });
    }
  };

  if (isDemoMode) {
    return (
      <div className="space-y-4 animate-fade-in pb-4">
        <h2 className="text-lg font-semibold text-white pt-1">Settings</h2>
        <Card className="bg-[#121317] border-white/5 shadow-lg">
          <div className="p-6 text-center">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-500/10 mb-4">
              <UserIcon className="h-7 w-7 text-emerald-400" />
            </div>
            <p className="text-sm text-zinc-300 mb-1">You're in Demo Mode</p>
            <p className="text-xs text-zinc-500 mb-5">Sign in to save your data and access all settings</p>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={onSignInClick}>
              Sign In / Create Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <h2 className="text-lg font-semibold text-white pt-1">Settings</h2>

      {/* Profile Card */}
      <Card className="bg-[#121317] border-white/5 shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
              <span className="text-base font-semibold">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{profile?.full_name ?? 'User'}</p>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <InfoRow icon={UserIcon} label="Name" value={profile?.full_name ?? 'N/A'} />
            <InfoRow icon={Mail} label="Email" value={user?.email ?? 'N/A'} />
            <InfoRow icon={MapPin} label="Province" value={provinceName(profile?.tax_province ?? 'ON')} />
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <SettingsSection title="Account">
        <SettingsRow icon={Settings} label="Edit Profile" onClick={() => setEditOpen(true)} />
        <SettingsRow icon={Download} label="Export Data" onClick={() => window.print()} />
        <SettingsRow icon={LogOut} label="Sign Out" onClick={handleSignOut} danger />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <ToggleRow icon={Bell} label="Push Notifications" description="Rent due & payout alerts" checked={notifications} onChange={setNotifications} />
        <ToggleRow icon={Receipt} label="Receipt Reminders" description="Missing receipt warnings" checked={receiptReminders} onChange={setReceiptReminders} />
        <ToggleRow icon={Shield} label="Tax Threshold Alerts" description="HST/GST $30K limit" checked={taxAlerts} onChange={setTaxAlerts} />
      </SettingsSection>

      {/* App */}
      <SettingsSection title="App">
        <SettingsRow icon={Moon} label="Dark Mode" value="On" />
        <SettingsRow icon={HelpCircle} label="Help & Support" onClick={() => toast({ title: 'Support', description: 'Email support@propledger.ca' })} />
      </SettingsSection>

      {/* Danger Zone */}
      <Card className="bg-[#121317] border-rose-500/10 shadow-lg">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-rose-400 mb-3 uppercase tracking-wide">Danger Zone</h3>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-3 w-full text-left hover:bg-rose-500/5 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
              <Trash2 className="h-4 w-4 text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-400">Delete Account</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Permanently remove all data</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600" />
          </button>
        </div>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm bg-[#121317] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-zinc-500">Update your name and tax province</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-zinc-500">Full Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white" />
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Tax Province</Label>
              <Select value={editProvince} onValueChange={setEditProvince}>
                <SelectTrigger className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1a1b20] border-white/10">
                  {CANADIAN_PROVINCES.map((p) => (<SelectItem key={p.code} value={p.code}>{p.name} ({p.code})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500" onClick={handleSaveProfile} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm bg-[#121317] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-rose-400 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete Account
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              This will permanently delete your account, all properties, and all financial records. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3">
              <p className="text-xs text-rose-300 leading-relaxed">
                Type <span className="font-bold font-mono">DELETE</span> below to confirm. All your properties, rent ledgers, Airbnb payouts, and T776 expense records will be erased.
              </p>
            </div>
            <Input
              placeholder="Type DELETE to confirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-11 bg-[#1a1b20] border-white/5 text-zinc-300 hover:text-white hover:bg-white/5" onClick={() => { setDeleteOpen(false); setDeleteConfirm(''); }}>
                Cancel
              </Button>
              <Button className="flex-1 h-11 bg-rose-600 hover:bg-rose-500 text-white" onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Forever'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-300 ml-auto">{value}</span>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-zinc-500 mb-2 px-1 uppercase tracking-wide">{title}</h3>
      <Card className="bg-[#121317] border-white/5 shadow-lg overflow-hidden">
        <div className="divide-y divide-white/5">{children}</div>
      </Card>
    </div>
  );
}

function SettingsRow({ icon: Icon, label, value, onClick, danger }: {
  icon: typeof Settings; label: string; value?: string; onClick?: () => void; danger?: boolean;
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors text-left">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${danger ? 'bg-rose-500/10' : 'bg-white/5'}`}>
        <Icon className={`h-4 w-4 ${danger ? 'text-rose-400' : 'text-zinc-400'}`} />
      </div>
      <span className={`text-sm font-medium flex-1 ${danger ? 'text-rose-400' : 'text-zinc-200'}`}>{label}</span>
      {value && <span className="text-xs text-zinc-500">{value}</span>}
      <ChevronRight className="h-4 w-4 text-zinc-600" />
    </button>
  );
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }: {
  icon: typeof Bell; label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
        <Icon className="h-4 w-4 text-zinc-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        <p className="text-[11px] text-zinc-500 mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

import { Receipt } from 'lucide-react';
