import { useMemo } from 'react';
import {
  Home,
  Plane,
  ChevronRight,
  MapPin,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatCurrencyPrecise } from '@/lib/format';

interface PropertiesViewProps {
  onPropertyClick: (propertyId: string) => void;
}

export function PropertiesView({ onPropertyClick }: PropertiesViewProps) {
  const { properties, rentPayments, strPayouts, expenses, tenants } = useData();

  const propertyData = useMemo(() => {
    return properties.map((property) => {
      const propRent = rentPayments
        .filter((r) => r.propertyId === property.id && r.status === 'Paid')
        .reduce((s, r) => s + r.amount, 0);
      const propPayouts = strPayouts
        .filter((s) => s.propertyId === property.id)
        .reduce((s, sp) => s + sp.netPayout, 0);
      const propExpenses = expenses
        .filter((e) => e.propertyId === property.id)
        .reduce((s, e) => s + e.amount, 0);
      const income = propRent + propPayouts;
      const net = income - propExpenses;
      const tenant = tenants[property.id];

      return {
        property,
        income,
        expenses: propExpenses,
        net,
        tenant,
      };
    });
  }, [properties, rentPayments, strPayouts, expenses, tenants]);

  const ltrCount = properties.filter((p) => p.type === 'LTR').length;
  const strCount = properties.filter((p) => p.type === 'STR').length;

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <div className="flex items-center gap-2.5 pt-1">
        <h2 className="text-lg font-semibold text-white">Properties</h2>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-0">
          {properties.length} total
        </Badge>
      </div>

      {/* Type Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-[#121317] border-white/5 shadow-lg">
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                <Home className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-xs text-zinc-400">Long-Term</span>
            </div>
            <p className="text-xl font-bold text-white font-mono tabular-nums">{ltrCount}</p>
          </div>
        </Card>
        <Card className="bg-[#121317] border-white/5 shadow-lg">
          <div className="p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
                <Plane className="h-3.5 w-3.5 text-rose-400" />
              </div>
              <span className="text-xs text-zinc-400">Airbnb / STR</span>
            </div>
            <p className="text-xl font-bold text-white font-mono tabular-nums">{strCount}</p>
          </div>
        </Card>
      </div>

      {/* Property Cards */}
      <div className="space-y-3 pt-1">
        {propertyData.map(({ property, income, expenses, net, tenant }) => {
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
                        <p className="text-sm font-semibold text-white">{property.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-zinc-600" />
                          <p className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                            {property.address}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-zinc-500 mb-0.5">Income</p>
                      <p className="text-sm font-semibold text-emerald-400 font-mono tabular-nums">
                        {formatCurrency(income)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 mb-0.5">Expenses</p>
                      <p className="text-sm font-semibold text-rose-400 font-mono tabular-nums">
                        {formatCurrency(expenses)}
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

                  {tenant && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                            <span className="text-[9px] font-semibold text-white">
                              {tenant.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400">{tenant.name}</span>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          tenant.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tenant.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {tenant.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
