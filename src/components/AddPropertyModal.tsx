import { useState, useEffect } from 'react';
import { Home, Plus, MapPin, User, DollarSign, Calendar, Plane, Loader2 } from 'lucide-react';
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
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { CANADIAN_PROVINCES } from '@/lib/canadian-provinces';

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPropertyModal({ open, onOpenChange }: AddPropertyModalProps) {
  const { addProperty } = useData();
  const { toast } = useToast();
  const [type, setType] = useState<'LTR' | 'STR'>('LTR');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState('ON');
  const [loading, setLoading] = useState(false);

  // LTR fields
  const [tenantName, setTenantName] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [leaseStart, setLeaseStart] = useState('');
  const [leaseEnd, setLeaseEnd] = useState('');

  // STR fields
  const [nightlyRate, setNightlyRate] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [strLicense, setStrLicense] = useState('');

  useEffect(() => {
    if (open) {
      setType('LTR');
      setName('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setProvince('ON');
      setTenantName('');
      setMonthlyRent('');
      setLeaseStart('');
      setLeaseEnd('');
      setNightlyRate('');
      setCleaningFee('');
      setStrLicense('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: 'Please enter a property name', variant: 'destructive' });
      return;
    }
    if (!address.trim() || !city.trim()) {
      toast({ title: 'Please enter the full address', variant: 'destructive' });
      return;
    }

    setLoading(true);

    const propertyData: Record<string, unknown> = {
      name,
      address,
      city,
      postal_code: postalCode,
      province,
      type,
    };

    if (type === 'LTR') {
      propertyData.tenant_name = tenantName;
      propertyData.monthly_rent = parseFloat(monthlyRent) || 0;
      propertyData.lease_start = leaseStart || null;
      propertyData.lease_end = leaseEnd || null;
      propertyData.lmr_deposit = parseFloat(monthlyRent) || 0;
    } else {
      propertyData.nightly_rate = parseFloat(nightlyRate) || 0;
      propertyData.cleaning_fee = parseFloat(cleaningFee) || 0;
      propertyData.str_license = strLicense;
    }

    await addProperty(propertyData as Parameters<typeof addProperty>[0]);

    toast({
      title: 'Property added',
      description: `${name} is now tracked in PropLedger`,
    });
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
              <Plus className="h-4 w-4 text-white" />
            </div>
            Add New Property
          </DialogTitle>
          <DialogDescription>Track a new rental property in PropLedger</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rental Type Toggle */}
          <div>
            <Label className="text-xs text-zinc-500 mb-1.5 block">Rental Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setType('LTR')}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                  type === 'LTR'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                }`}
              >
                <Home className="h-4 w-4" strokeWidth={2} />
                <span className="text-sm font-medium">Long-Term</span>
              </button>
              <button
                onClick={() => setType('STR')}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                  type === 'STR'
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                }`}
              >
                <Plane className="h-4 w-4" strokeWidth={2} />
                <span className="text-sm font-medium">Airbnb / STR</span>
              </button>
            </div>
          </div>

          {/* Property Name */}
          <div>
            <Label className="text-xs text-zinc-500">Property Name</Label>
            <Input
              placeholder="e.g., 144 King St, Banff Cabin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11"
            />
          </div>

          {/* Address */}
          <div>
            <Label className="text-xs text-zinc-500">Street Address</Label>
            <Input
              placeholder="144 King Street W"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 h-11"
            />
          </div>

          {/* City + Province + Postal Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-zinc-500">City</Label>
              <Input
                placeholder="Toronto"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 h-11"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Province</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="mt-1 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CANADIAN_PROVINCES.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-zinc-500">Postal Code</Label>
            <Input
              placeholder="M5H 1H2"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="mt-1 h-11"
            />
          </div>

          {/* LTR-specific fields */}
          {type === 'LTR' && (
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <User className="h-3.5 w-3.5" />
                Tenant Details
              </div>
              <div>
                <Label className="text-xs text-zinc-500">Tenant Name</Label>
                <Input
                  placeholder="Sarah Mitchell"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-500">Monthly Rent ($)</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    type="number"
                    placeholder="2450"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="pl-9 h-11 font-mono tabular-nums"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-zinc-500">Lease Start</Label>
                  <Input
                    type="date"
                    value={leaseStart}
                    onChange={(e) => setLeaseStart(e.target.value)}
                    className="mt-1 h-11"
                  />
                </div>
                <div>
                  <Label className="text-xs text-zinc-500">Lease End</Label>
                  <Input
                    type="date"
                    value={leaseEnd}
                    onChange={(e) => setLeaseEnd(e.target.value)}
                    className="mt-1 h-11"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STR-specific fields */}
          {type === 'STR' && (
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
                <Plane className="h-3.5 w-3.5" />
                Airbnb Details
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-zinc-500">Nightly Rate ($)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      type="number"
                      placeholder="250"
                      value={nightlyRate}
                      onChange={(e) => setNightlyRate(e.target.value)}
                      className="pl-9 h-11 font-mono tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-zinc-500">Cleaning Fee ($)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      type="number"
                      placeholder="150"
                      value={cleaningFee}
                      onChange={(e) => setCleaningFee(e.target.value)}
                      className="pl-9 h-11 font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs text-zinc-500">STR License / Registration #</Label>
                <Input
                  placeholder="STR-2026-12345"
                  value={strLicense}
                  onChange={(e) => setStrLicense(e.target.value)}
                  className="mt-1 h-11"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 h-11" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Property
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
