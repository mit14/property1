import { useState, useEffect } from 'react';
import { Building2, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
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
import { CANADIAN_PROVINCES } from '@/lib/canadian-provinces';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState('ON');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setFullName('');
      setEmail('');
      setPassword('');
      setProvince('ON');
    }
  }, [open]);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const { error } = await signUp(fullName, email, password, province);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      toast({ title: 'Account created', description: 'Welcome to PropLedger!' });
      onOpenChange(false);
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      toast({ title: 'Welcome back!' });
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#121317] border-white/10">
        <DialogHeader>
          <div className="flex flex-col items-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/30 mb-3">
              <Building2 className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>
            <DialogTitle className="text-lg font-semibold text-white">
              {mode === 'signin' ? 'Sign in to PropLedger' : 'Create your account'}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 mt-1">
              {mode === 'signin'
                ? 'Access your rental property dashboard'
                : 'Start tracking your Canadian rental properties'}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {mode === 'signup' && (
            <div>
              <Label className="text-xs text-zinc-500">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input
                  placeholder="John Mitchell"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs text-zinc-500">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-zinc-500">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="pl-9 h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <Label className="text-xs text-zinc-500">Province of Residence (for tax)</Label>
              <Select value={province} onValueChange={setProvince}>
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
          )}

          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2">
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            </div>
          )}

          <Button
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          <div className="text-center pt-1">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
