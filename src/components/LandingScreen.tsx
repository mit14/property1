import { useState } from 'react';
import { Building2, TrendingUp, FileText, ShieldCheck, ArrowRight, Loader2, Mail, Lock, User, ChevronLeft } from 'lucide-react';
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

export function LandingScreen() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState('ON');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Please enter your full name'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      const { error } = await signUp(fullName, email, password, province);
      if (error) { setError(error); setLoading(false); return; }
      toast({ title: 'Account created', description: 'Welcome to PropLedger!' });
    } else {
      const { error } = await signIn(email, password);
      if (error) { setError(error); setLoading(false); return; }
      toast({ title: 'Welcome back!' });
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col justify-center px-6 pt-16 pb-8 max-h-[42vh]">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-900/20 to-transparent" />
        <div className="absolute top-20 right-6 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-2xl shadow-emerald-600/30 mb-5">
            <Building2 className="h-8 w-8 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PropLedger</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-[240px] leading-relaxed">
            Track Canadian rental properties, Airbnb income, and T776 tax deductions — all in one place.
          </p>
        </div>
      </div>

      {/* Auth Form Card */}
      <div className="flex-1 bg-[#121317] rounded-t-3xl border-t border-white/5 px-6 pt-6 pb-8 overflow-y-auto">
        <div className="max-w-sm mx-auto">
          {/* Mode Toggle */}
          <div className="flex bg-[#1a1b20] rounded-xl p-1 mb-5">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                mode === 'signin' ? 'bg-emerald-600 text-white' : 'text-zinc-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                mode === 'signup' ? 'bg-emerald-600 text-white' : 'text-zinc-500'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Auth */}
          <div className="space-y-2.5 mb-4">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 w-full h-11 rounded-xl bg-[#1a1b20] border border-white/5 text-white text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 w-full h-11 rounded-xl bg-[#1a1b20] border border-white/5 text-white text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.8 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.04l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-zinc-600">or use email</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Email Form */}
          <div className="space-y-3">
            {mode === 'signup' && (
              <div>
                <Label className="text-xs text-zinc-500">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input placeholder="John Mitchell" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-9 h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600" />
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs text-zinc-500">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} className="pl-9 h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600" />
              </div>
            </div>
            {mode === 'signup' && (
              <div>
                <Label className="text-xs text-zinc-500">Province (for tax)</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1b20] border-white/10">
                    {CANADIAN_PROVINCES.map((p) => (
                      <SelectItem key={p.code} value={p.code}>{p.name} ({p.code})</SelectItem>
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

            <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Feature badges */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-white/5">
            <FeatureBadge icon={TrendingUp} label="Cash Flow" />
            <FeatureBadge icon={FileText} label="T776 Tax" />
            <FeatureBadge icon={ShieldCheck} label="Secure" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureBadge({ icon: Icon, label }: { icon: typeof TrendingUp; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-4 w-4 text-emerald-500/60" strokeWidth={2} />
      <span className="text-[10px] text-zinc-600">{label}</span>
    </div>
  );
}
