import { useMemo } from 'react';
import {
  ArrowLeft,
  Home,
  Plane,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  FileText,
  Paperclip,
  TrendingUp,
  TrendingDown,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useData, type TenantInfo } from '@/contexts/DataContext';
import { formatCurrency, formatCurrencyPrecise, formatDate, formatDateShort, formatMonthYear } from '@/lib/format';
import type { ActivityItem, PaymentStatus, Property } from '@/lib/types';

interface PropertyDetailViewProps {
  propertyId: string;
  onBack: () => void;
}

const statusConfig: Record<PaymentStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle2 },
  Pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: Clock },
  Overdue: { bg: 'bg-rose-500/10', text: 'text-rose-400', icon: AlertCircle },
};

export function PropertyDetailView({ propertyId, onBack }: PropertyDetailViewProps) {
  const { properties, rentPayments, strPayouts, expenses, tenants } = useData();

  const property = properties.find((p) => p.id === propertyId);
  if (!property) {
    return (
      <div className="p-4 text-center text-zinc-500">
        <p>Property not found.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const isSTR = property.type === 'STR';
  const tenant = tenants[propertyId];

  const propRent = rentPayments
    .filter((r) => r.propertyId === propertyId && r.status === 'Paid')
    .reduce((s, r) => s + r.amount, 0);
  const propPayouts = strPayouts
    .filter((s) => s.propertyId === propertyId)
    .reduce((s, sp) => s + sp.netPayout, 0);
  const propExpenses = expenses
    .filter((e) => e.propertyId === propertyId)
    .reduce((s, e) => s + e.amount, 0);
  const income = propRent + propPayouts;
  const net = income - propExpenses;

  const activity: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];

    rentPayments
      .filter((r) => r.propertyId === propertyId)
      .forEach((rp) => {
        items.push({
          id: `act-${rp.id}`,
          type: 'rent',
          propertyId: rp.propertyId,
          description: `Rent - ${new Date(rp.month).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}`,
          amount: rp.amount,
          date: rp.date,
          hasReceipt: true,
        });
      });

    strPayouts
      .filter((s) => s.propertyId === propertyId)
      .forEach((sp) => {
        items.push({
          id: `act-${sp.id}`,
          type: 'airbnb_payout',
          propertyId: sp.propertyId,
          description: 'Airbnb payout',
          amount: sp.netPayout,
          date: sp.date,
          hasReceipt: false,
        });
      });

    expenses
      .filter((e) => e.propertyId === propertyId)
      .forEach((ex) => {
        items.push({
          id: `act-${ex.id}`,
          type: 'expense',
          propertyId: ex.propertyId,
          description: ex.description,
          amount: ex.amount,
          date: ex.date,
          categoryCode: ex.categoryCode,
          hasReceipt: ex.hasReceipt,
        });
      });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [propertyId, rentPayments, strPayouts, expenses]);

  const propRentPayments = rentPayments.filter((r) => r.propertyId === propertyId);
  const propSTRPayouts = strPayouts.filter((s) => s.propertyId === propertyId);

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors pt-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Properties
      </button>

      {/* Property Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1b20] to-[#121317] border border-white/5 p-5 shadow-xl">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                isSTR ? 'bg-rose-500/10' : 'bg-emerald-500/10'
              }`}>
                {isSTR ? (
                  <Plane className="h-5 w-5 text-rose-400" strokeWidth={2} />
                ) : (
                  <Home className="h-5 w-5 text-emerald-400" strokeWidth={2} />
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">{property.name}</h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">{property.address}</p>
              </div>
            </div>
            <Badge className={`border-0 ${isSTR ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {isSTR ? 'Airbnb' : 'Long-Term'}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <p className="text-[10px] text-zinc-500">Income</p>
              </div>
              <p className="text-sm font-semibold text-emerald-400 font-mono tabular-nums">
                {formatCurrency(income)}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingDown className="h-3 w-3 text-rose-400" />
                <p className="text-[10px] text-zinc-500">Expenses</p>
              </div>
              <p className="text-sm font-semibold text-rose-400 font-mono tabular-nums">
                {formatCurrency(propExpenses)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 mb-0.5">Net</p>
              <p className={`text-sm font-semibold font-mono tabular-nums ${
                net >= 0 ? 'text-white' : 'text-rose-400'
              }`}>
                {formatCurrencyPrecise(net)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LTR: Tenant Info */}
      {tenant && (
        <Card className="bg-[#121317] border-white/5 shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Tenant</h3>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig[tenant.status].bg}`}>
                {(() => {
                  const StatusIcon = statusConfig[tenant.status].icon;
                  return <StatusIcon className={`h-3 w-3 ${statusConfig[tenant.status].text}`} />;
                })()}
                <span className={`text-[10px] font-medium ${statusConfig[tenant.status].text}`}>
                  {tenant.status}
                </span>
              </div>
            </div>
            <div className="space-y-2.5">
              <InfoRow icon={User} label="Name" value={tenant.name} />
              <InfoRow icon={Mail} label="Email" value={tenant.email} />
              <InfoRow icon={Phone} label="Phone" value={tenant.phone} />
              <InfoRow icon={Calendar} label="Lease" value={`${formatDate(tenant.leaseStart)} → ${formatDate(tenant.leaseEnd)}`} />
            </div>
            <Separator className="my-3 bg-white/5" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] text-zinc-500 mb-1">Monthly Rent</p>
                <p className="text-base font-bold text-white font-mono tabular-nums">
                  {formatCurrencyPrecise(tenant.monthlyRent)}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <p className="text-[10px] text-zinc-500">LMR Deposit</p>
                </div>
                <p className="text-base font-bold text-white font-mono tabular-nums">
                  {formatCurrencyPrecise(tenant.lmrDeposit)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* LTR: Rent Ledger */}
      {!isSTR && propRentPayments.length > 0 && (
        <Card className="bg-[#121317] border-white/5 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Rent Ledger</h3>
            <span className="text-xs text-zinc-500 font-mono tabular-nums">
              {formatCurrency(propRent)} collected
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {propRentPayments.map((payment) => {
              const cfg = statusConfig[payment.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={payment.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg} shrink-0`}>
                    <StatusIcon className={`h-4 w-4 ${cfg.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200">{formatMonthYear(payment.month)}</p>
                    <p className="text-[11px] text-zinc-500">{payment.method}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-white font-mono tabular-nums">
                      {formatCurrencyPrecise(payment.amount)}
                    </p>
                    <span className={`text-[10px] font-medium ${cfg.text}`}>{payment.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* STR: Payout History */}
      {isSTR && propSTRPayouts.length > 0 && (
        <Card className="bg-[#121317] border-white/5 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Payout History</h3>
            <span className="text-xs text-zinc-500">{propSTRPayouts.length} payouts</span>
          </div>
          <div className="divide-y divide-white/5">
            {propSTRPayouts.map((payout) => (
              <div key={payout.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                    <span className="text-sm font-medium text-zinc-200">{formatDate(payout.date)}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                    +{formatCurrencyPrecise(payout.netPayout)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                  <span>Gross: <span className="font-mono tabular-nums text-zinc-400">{formatCurrencyPrecise(payout.grossBooking)}</span></span>
                  <span>Fee: <span className="font-mono tabular-nums text-rose-400">−{formatCurrencyPrecise(payout.platformFee)}</span></span>
                  <span>Cleaning: <span className="font-mono tabular-nums text-blue-400">{formatCurrencyPrecise(payout.cleaningFee)}</span></span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Activity Feed */}
      <Card className="bg-[#121317] border-white/5 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Activity</h3>
          <span className="text-xs text-zinc-500">{activity.length} transactions</span>
        </div>
        <div className="divide-y divide-white/5">
          {activity.map((item) => {
            const isIncome = item.type !== 'expense';
            const itemIsSTR = item.type === 'airbnb_payout';
            const Icon = itemIsSTR ? Plane : item.type === 'rent' ? Home : FileText;
            const iconBg = itemIsSTR
              ? 'bg-rose-500/10 text-rose-400'
              : item.type === 'rent'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-white/5 text-zinc-400';

            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} shrink-0`}>
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-200 truncate">{item.description}</p>
                    {item.categoryCode && (
                      <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono text-zinc-500 border-white/10 bg-white/5">
                        L{item.categoryCode}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-zinc-500">{formatDateShort(item.date)}</span>
                    {item.hasReceipt ? (
                      <Paperclip className="h-3 w-3 text-zinc-600" />
                    ) : (
                      <span className="text-[10px] text-amber-500/70">no receipt</span>
                    )}
                  </div>
                </div>
                <p className={`text-sm font-semibold font-mono tabular-nums shrink-0 ${
                  isIncome ? 'text-emerald-400' : 'text-zinc-300'
                }`}>
                  {isIncome ? '+' : '−'}{formatCurrency(item.amount)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 shrink-0">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-zinc-500">{label}</p>
        <p className="text-sm text-zinc-200 truncate">{value}</p>
      </div>
    </div>
  );
}
