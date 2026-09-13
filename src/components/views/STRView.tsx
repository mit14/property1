import { useState } from 'react';
import {
  Plane,
  DollarSign,
  Scissors,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Plus,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatCurrencyPrecise, formatDate } from '@/lib/format';
import { STR_THRESHOLD } from '@/lib/types';
import type { STRPayout } from '@/lib/types';

export function STRView() {
  const { properties, strPayouts, addSTRPayout } = useData();
  const strProperties = properties.filter((p) => p.type === 'STR');
  const [payoutsByProp, setPayoutsByProp] = useState<Record<string, STRPayout[]>>({});
  const [showLogger, setShowLogger] = useState<string | null>(null);

  const allPayouts = [...strPayouts, ...Object.values(payoutsByProp).flat()];

  const cumulativeRevenue = allPayouts.reduce((sum, p) => sum + p.grossBooking, 0);
  const thresholdPercent = Math.min((cumulativeRevenue / STR_THRESHOLD) * 100, 100);
  const remaining = Math.max(STR_THRESHOLD - cumulativeRevenue, 0);
  const isOverThreshold = cumulativeRevenue >= STR_THRESHOLD;

  const totalGross = allPayouts.reduce((s, p) => s + p.grossBooking, 0);
  const totalFees = allPayouts.reduce((s, p) => s + p.platformFee, 0);
  const totalCleaning = allPayouts.reduce((s, p) => s + p.cleaningFee, 0);
  const totalNet = allPayouts.reduce((s, p) => s + p.netPayout, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500">
          <Plane className="h-4 w-4 text-white" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900">Short-Term Rentals</h2>
        <Badge className="bg-rose-50 text-rose-600 border-rose-200/60 hover:bg-rose-50">
          Airbnb
        </Badge>
      </div>

      {strProperties.length === 0 && (
        <Card className="border-zinc-200/80 shadow-sm">
          <div className="p-8 text-center">
            <Plane className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">No short-term rental properties yet.</p>
            <p className="text-xs text-zinc-400 mt-1">Use "Add Property" to create one.</p>
          </div>
        </Card>
      )}

      {/* HST/GST Threshold Alert */}
      <Card className={`border-2 shadow-sm ${isOverThreshold ? 'border-rose-300' : 'border-amber-200/60'}`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isOverThreshold ? 'bg-rose-50' : 'bg-amber-50'}`}>
                {isOverThreshold ? (
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                ) : (
                  <TrendingUp className="h-4.5 w-4.5 text-amber-500" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">CRA HST/GST Small-Supplier Threshold</h3>
                <p className="text-xs text-zinc-400">Cumulative STR revenue toward $30,000 limit</p>
              </div>
            </div>
            <span className={`text-xs font-bold font-mono tabular-nums ${isOverThreshold ? 'text-rose-600' : 'text-amber-600'}`}>
              {thresholdPercent.toFixed(1)}%
            </span>
          </div>

          <Progress
            value={thresholdPercent}
            className={`h-3 ${isOverThreshold ? 'bg-rose-100' : 'bg-amber-100'}`}
          />

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-xs text-zinc-400">Cumulative Revenue</p>
              <p className="text-lg font-bold text-zinc-900 font-mono tabular-nums">
                {formatCurrencyPrecise(cumulativeRevenue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400">{isOverThreshold ? 'Over threshold by' : 'Remaining'}</p>
              <p className={`text-lg font-bold font-mono tabular-nums ${isOverThreshold ? 'text-rose-600' : 'text-emerald-600'}`}>
                {formatCurrencyPrecise(Math.abs(remaining))}
              </p>
            </div>
          </div>

          {isOverThreshold && (
            <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200/60 px-3 py-2">
              <p className="text-xs text-rose-700 font-medium">
                Threshold exceeded — HST/GST registration with CRA is required.
              </p>
            </div>
          )}
          {!isOverThreshold && thresholdPercent > 75 && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200/60 px-3 py-2">
              <p className="text-xs text-amber-700 font-medium">
                Approaching threshold — prepare to register for HST/GST with the CRA.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Gross Bookings" value={formatCurrency(totalGross)} icon={DollarSign} color="text-zinc-700" />
        <StatBox label="Platform Fees" value={formatCurrency(totalFees)} icon={Scissors} color="text-rose-500" />
        <StatBox label="Cleaning Fees" value={formatCurrency(totalCleaning)} icon={Sparkles} color="text-blue-500" />
        <StatBox label="Net Payouts" value={formatCurrency(totalNet)} icon={TrendingUp} color="text-emerald-600" />
      </div>

      {strProperties.map((strProperty) => {
        const propPayouts = [
          ...strPayouts.filter((s) => s.propertyId === strProperty.id),
          ...(payoutsByProp[strProperty.id] ?? []),
        ];

        return (
          <div key={strProperty.id} className="space-y-3">
            <Card className="border-zinc-200/80 shadow-sm">
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-zinc-900">{strProperty.name}</h3>
                  <Badge className="bg-rose-50 text-rose-600 border-rose-200/60">Airbnb</Badge>
                </div>
                <p className="text-sm text-zinc-400">{strProperty.address}</p>
              </div>
            </Card>

            {showLogger === strProperty.id ? (
              <PayoutLoggerForm
                propertyId={strProperty.id}
                onSubmit={(payout) => {
                  setPayoutsByProp((prev) => ({
                    ...prev,
                    [strProperty.id]: [payout, ...(prev[strProperty.id] ?? [])],
                  }));
                  addSTRPayout(payout);
                  setShowLogger(null);
                }}
                onCancel={() => setShowLogger(null)}
              />
            ) : (
              <Button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20"
                onClick={() => setShowLogger(strProperty.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Log New Payout
              </Button>
            )}

            <Card className="border-zinc-200/80 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900">Payout History</h3>
                <span className="text-xs text-zinc-400">{propPayouts.length} payouts</span>
              </div>
              <div className="divide-y divide-zinc-50">
                {propPayouts.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-zinc-400">No payouts logged yet.</p>
                  </div>
                )}
                {propPayouts.map((payout) => (
                  <div key={payout.id} className="px-5 py-3.5 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-zinc-300" />
                        <span className="text-sm font-medium text-zinc-700">{formatDate(payout.date)}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 font-mono tabular-nums">
                        +{formatCurrencyPrecise(payout.netPayout)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span>Gross: <span className="font-mono tabular-nums text-zinc-600">{formatCurrencyPrecise(payout.grossBooking)}</span></span>
                      <span>Fee: <span className="font-mono tabular-nums text-rose-500">−{formatCurrencyPrecise(payout.platformFee)}</span></span>
                      <span>Cleaning: <span className="font-mono tabular-nums text-blue-500">{formatCurrencyPrecise(payout.cleaningFee)}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

function StatBox({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  color: string;
}) {
  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <div className="p-3">
        <Icon className={`h-4 w-4 mb-2 ${color}`} strokeWidth={2} />
        <p className="text-[11px] text-zinc-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-zinc-900 font-mono tabular-nums">{value}</p>
      </div>
    </Card>
  );
}

function PayoutLoggerForm({
  propertyId,
  onSubmit,
  onCancel,
}: {
  propertyId: string;
  onSubmit: (payout: STRPayout) => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const [grossBooking, setGrossBooking] = useState('');
  const [platformFee, setPlatformFee] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const gross = parseFloat(grossBooking) || 0;
  const fee = parseFloat(platformFee) || 0;
  const cleaning = parseFloat(cleaningFee) || 0;
  const net = gross - fee + cleaning;

  const handleSubmit = () => {
    if (!gross || gross <= 0) {
      toast({ title: 'Please enter a gross booking amount', variant: 'destructive' });
      return;
    }
    onSubmit({
      id: `sp-${Date.now()}`,
      propertyId,
      date,
      grossBooking: gross,
      platformFee: fee,
      cleaningFee: cleaning,
      netPayout: net,
    });
    toast({ title: 'Payout logged successfully' });
  };

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Log New Payout</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-zinc-500">Gross Booking Payout ($)</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={grossBooking}
              onChange={(e) => setGrossBooking(e.target.value)}
              className="mt-1 font-mono tabular-nums"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-zinc-500">Platform Fee ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="mt-1 font-mono tabular-nums"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Cleaning Fee ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={cleaningFee}
                onChange={(e) => setCleaningFee(e.target.value)}
                className="mt-1 font-mono tabular-nums"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-zinc-500">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2.5">
            <span className="text-sm font-medium text-emerald-800">Net Payout</span>
            <span className="text-lg font-bold text-emerald-700 font-mono tabular-nums">
              {formatCurrencyPrecise(net)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
              Save Payout
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
