import { useMemo, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  ArrowUpRight,
  FileText,
  Plane,
  Home,
  Paperclip,
  Plus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, formatCurrencyPrecise, formatDateShort } from '@/lib/format';
import { useData } from '@/contexts/DataContext';
import type { ActivityItem } from '@/lib/types';

interface DashboardViewProps {
  selectedProperty: string;
  onPropertyChange: (id: string) => void;
  onAddPropertyClick: () => void;
}

export function DashboardView({ selectedProperty, onPropertyChange, onAddPropertyClick }: DashboardViewProps) {
  const { properties, rentPayments, strPayouts, expenses } = useData();

  const filterPills = useMemo(
    () => [
      { id: 'all', label: 'All Properties', type: undefined as string | undefined },
      ...properties.map((p) => ({
        id: p.id,
        label: p.name,
        type: (p.type === 'STR' ? 'Airbnb' : 'Long-Term') as string | undefined,
      })),
    ],
    [properties]
  );

  const activityFeed = useMemo(() => {
    const items: ActivityItem[] = [];

    rentPayments.forEach((rp) => {
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

    strPayouts.forEach((sp) => {
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

    expenses.forEach((ex) => {
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
  }, [rentPayments, strPayouts, expenses]);

  const filteredActivity = useMemo(() => {
    if (selectedProperty === 'all') return activityFeed;
    return activityFeed.filter((a) => a.propertyId === selectedProperty);
  }, [activityFeed, selectedProperty]);

  const metrics = useMemo(() => {
    const ltrRent = rentPayments
      .filter((r) => selectedProperty === 'all' || r.propertyId === selectedProperty)
      .filter((r) => r.status === 'Paid')
      .reduce((sum, r) => sum + r.amount, 0);

    const strNet = strPayouts
      .filter((s) => selectedProperty === 'all' || s.propertyId === selectedProperty)
      .reduce((sum, s) => sum + s.netPayout, 0);

    const totalExpenses = expenses
      .filter((e) => selectedProperty === 'all' || e.propertyId === selectedProperty)
      .reduce((sum, e) => sum + e.amount, 0);

    const grossIncome = ltrRent + strNet;
    const netCashFlow = grossIncome - totalExpenses;

    return { netCashFlow, grossIncome, t776Deductions: totalExpenses };
  }, [selectedProperty, rentPayments, strPayouts, expenses]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Net Cash Flow (YTD)"
          value={formatCurrency(metrics.netCashFlow)}
          icon={TrendingUp}
          accent="emerald"
          trend="+12.4%"
          trendUp
        />
        <MetricCard
          label="Gross Income"
          value={formatCurrency(metrics.grossIncome)}
          icon={DollarSign}
          accent="blue"
          trend="+8.2%"
          trendUp
        />
        <MetricCard
          label="T776 Deductions"
          value={formatCurrencyPrecise(metrics.t776Deductions)}
          icon={Receipt}
          accent="amber"
          trend="Tax deductible"
        />
      </div>

      {/* Property Filter Pills + Add Property */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
          {filterPills.map((pill) => {
            const isActive = selectedProperty === pill.id;
            const isSTR = pill.type === 'Airbnb';
            return (
              <button
                key={pill.id}
                onClick={() => onPropertyChange(pill.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? isSTR
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-zinc-600 border border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                {pill.type && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSTR ? 'bg-rose-200' : 'bg-emerald-200'
                    } ${isActive ? 'bg-white/60' : ''}`}
                  />
                )}
                {pill.label}
                {pill.type && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20'
                        : isSTR
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {pill.type}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={onAddPropertyClick}
          className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Recent Activity Feed */}
      <Card className="border-zinc-200/80 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">Recent Activity</h3>
          <span className="text-xs text-zinc-400">{filteredActivity.length} transactions</span>
        </div>
        <ScrollArea className="h-[420px]">
          <div className="divide-y divide-zinc-50">
            {filteredActivity.map((item) => (
              <ActivityRow key={item.id} item={item} properties={properties} />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  accent: 'emerald' | 'blue' | 'amber';
  trend: string;
  trendUp?: boolean;
}) {
  const accentClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <Card className="border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClasses[accent]}`}>
            <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trendUp && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
              <span className={trendUp ? 'text-emerald-600 font-medium' : 'text-zinc-400'}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-400 mb-1">{label}</p>
        <p className="text-xl font-bold text-zinc-900 font-mono tabular-nums">{value}</p>
      </div>
    </Card>
  );
}

function ActivityRow({ item, properties }: { item: ActivityItem; properties: { id: string; name: string }[] }) {
  const property = properties.find((p) => p.id === item.propertyId);
  const isIncome = item.type !== 'expense';
  const isSTR = item.type === 'airbnb_payout';

  const iconBg = isSTR
    ? 'bg-rose-50 text-rose-500'
    : item.type === 'rent'
    ? 'bg-emerald-50 text-emerald-600'
    : 'bg-zinc-100 text-zinc-500';

  const Icon = isSTR ? Plane : item.type === 'rent' ? Home : FileText;

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50/50 transition-colors">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} shrink-0`}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-800 truncate">{item.description}</p>
          {item.categoryCode && (
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono text-zinc-400 border-zinc-200">
              L{item.categoryCode}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-400">{property?.name ?? 'Unknown'}</span>
          <span className="text-zinc-300 text-xs">·</span>
          <span className="text-xs text-zinc-400">{formatDateShort(item.date)}</span>
          {item.hasReceipt ? (
            <Paperclip className="h-3 w-3 text-zinc-300 ml-1" />
          ) : (
            <span className="text-[10px] text-amber-500 ml-1">no receipt</span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`text-sm font-semibold font-mono tabular-nums ${
            isIncome ? 'text-emerald-600' : 'text-zinc-700'
          }`}
        >
          {isIncome ? '+' : '−'}
          {formatCurrency(item.amount)}
        </p>
      </div>
    </div>
  );
}
