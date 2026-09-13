import { useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Plane,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatCurrencyPrecise } from '@/lib/format';
import type { TabKey } from '@/components/BottomNav';

interface HomeViewProps {
  onNavigate: (tab: TabKey) => void;
  onPropertyClick: (propertyId: string) => void;
}

export function HomeView({ onNavigate, onPropertyClick }: HomeViewProps) {
  const { properties, rentPayments, strPayouts, expenses } = useData();

  const metrics = useMemo(() => {
    const ltrRent = rentPayments
      .filter((r) => r.status === 'Paid')
      .reduce((sum, r) => sum + r.amount, 0);

    const strNet = strPayouts.reduce((sum, s) => sum + s.netPayout, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      netCashFlow: ltrRent + strNet - totalExpenses,
      grossIncome: ltrRent + strNet,
      t776Deductions: totalExpenses,
    };
  }, [rentPayments, strPayouts, expenses]);

  const ltrProperties = properties.filter((p) => p.type === 'LTR');
  const strProperties = properties.filter((p) => p.type === 'STR');

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Balance Card — Banking App Style */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-5 shadow-xl shadow-emerald-900/30">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-300/10 blur-xl" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-200" />
              <span className="text-xs font-medium text-emerald-100/80">Net Cash Flow (YTD)</span>
            </div>
            <Badge className="bg-white/10 text-emerald-100 border-0 backdrop-blur-sm">
              2026
            </Badge>
          </div>
          <p className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
            {formatCurrencyPrecise(metrics.netCashFlow)}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <ArrowUpRight className="h-3 w-3 text-emerald-200" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-200/60">Income</p>
                <p className="text-xs font-semibold text-white font-mono tabular-nums">
                  {formatCurrency(metrics.grossIncome)}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <ArrowDownRight className="h-3 w-3 text-rose-200" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-200/60">Expenses</p>
                <p className="text-xs font-semibold text-white font-mono tabular-nums">
                  {formatCurrency(metrics.t776Deductions)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Gross Income"
          value={formatCurrency(metrics.grossIncome)}
          icon={DollarSign}
          iconBg="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="T776 Deductions"
          value={formatCurrencyPrecise(metrics.t776Deductions)}
          icon={Receipt}
          iconBg="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Properties Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Your Properties</h3>
          <button
            onClick={() => onNavigate('properties')}
            className="text-xs text-emerald-400 font-medium flex items-center gap-0.5 hover:text-emerald-300"
          >
            View All <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3">
          {properties.map((property) => {
            const propRent = rentPayments
              .filter((r) => r.propertyId === property.id && r.status === 'Paid')
              .reduce((s, r) => s + r.amount, 0);
            const propPayouts = strPayouts
              .filter((s) => s.propertyId === property.id)
              .reduce((s, sp) => s + sp.netPayout, 0);
            const propExpenses = expenses
              .filter((e) => e.propertyId === property.id)
              .reduce((s, e) => s + e.amount, 0);
            const propIncome = propRent + propPayouts;
            const isSTR = property.type === 'STR';

            return (
              <button
                key={property.id}
                onClick={() => onPropertyClick(property.id)}
                className="w-full text-left"
              >
                <Card className="bg-[#121317] border-white/5 shadow-lg hover:border-white/10 transition-all group">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isSTR ? 'bg-rose-500/10' : 'bg-emerald-500/10'
                        }`}>
                          {isSTR ? (
                            <Plane className="h-5 w-5 text-rose-400" strokeWidth={2} />
                          ) : (
                            <Home className="h-5 w-5 text-emerald-400" strokeWidth={2} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{property.name}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {isSTR ? 'Short-Term Rental' : 'Long-Term Rental'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-zinc-500">Net Income</p>
                        <p className="text-base font-bold text-white font-mono tabular-nums">
                          {formatCurrency(propIncome - propExpenses)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-500">Expenses</p>
                        <p className="text-sm font-medium text-zinc-400 font-mono tabular-nums">
                          {formatCurrency(propExpenses)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tax Summary Preview */}
      <button onClick={() => onNavigate('report')} className="w-full text-left">
        <Card className="bg-[#121317] border-white/5 shadow-lg hover:border-white/10 transition-all group">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Receipt className="h-5 w-5 text-emerald-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">T776 Tax Report</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {formatCurrencyPrecise(metrics.t776Deductions)} in deductions
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
          </div>
        </Card>
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  iconBg: string;
}) {
  return (
    <Card className="bg-[#121317] border-white/5 shadow-lg">
      <div className="p-3.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} mb-2.5`}>
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <p className="text-[11px] text-zinc-500 mb-0.5">{label}</p>
        <p className="text-base font-bold text-white font-mono tabular-nums">{value}</p>
      </div>
    </Card>
  );
}
