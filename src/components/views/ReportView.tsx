import { useMemo, useState } from 'react';
import { FileText, ChevronDown, ChevronRight, Download, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyPrecise, formatDate } from '@/lib/format';
import { useData } from '@/contexts/DataContext';
import { T776_CATEGORIES } from '@/lib/types';
import type { Expense } from '@/lib/types';

export function ReportView() {
  const { properties, expenses } = useData();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    if (propertyFilter === 'all') return expenses;
    return expenses.filter((e) => e.propertyId === propertyFilter);
  }, [expenses, propertyFilter]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    T776_CATEGORIES.forEach((cat) => {
      const items = filteredExpenses.filter((e) => e.categoryCode === cat.code);
      if (items.length > 0) groups[cat.code] = items;
    });
    return groups;
  }, [filteredExpenses]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.entries(groupedByCategory).forEach(([code, items]) => {
      totals[code] = items.reduce((sum, e) => sum + e.amount, 0);
    });
    return totals;
  }, [groupedByCategory]);

  const grandTotal = useMemo(() => {
    return Object.values(categoryTotals).reduce((sum, t) => sum + t, 0);
  }, [categoryTotals]);

  const toggleCategory = (code: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const propertyOptions = [
    { id: 'all', name: 'All Properties' },
    ...properties,
  ];

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <div className="flex items-center gap-2.5 pt-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
          <FileText className="h-4 w-4 text-white" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-semibold text-white">T776 Tax Report</h2>
      </div>

      {/* Property Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {propertyOptions.map((opt) => {
          const isActive = propertyFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setPropertyFilter(opt.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-[#121317] text-zinc-400 border border-white/5 hover:text-zinc-200'
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>

      {/* Grand Total Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 shadow-xl shadow-emerald-900/30">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-100/70 mb-1">Total T776 Deductions (2026 YTD)</p>
            <p className="text-2xl font-bold text-white font-mono tabular-nums">
              {formatCurrencyPrecise(grandTotal)}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-100">
                {Object.keys(groupedByCategory).length} categories
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-100">
                {filteredExpenses.length} entries
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <FileText className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <Card className="bg-[#121317] border-white/5 shadow-lg">
        <div className="px-4 py-3.5 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Expenses by T776 Line Item</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Grouped by CRA Form T776 categories</p>
        </div>
        <div className="divide-y divide-white/5">
          {Object.entries(groupedByCategory).map(([code, items]) => {
            const category = T776_CATEGORIES.find((c) => c.code === code);
            const total = categoryTotals[code];
            const isExpanded = expandedCategories.has(code);
            return (
              <div key={code}>
                <button
                  onClick={() => toggleCategory(code)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-zinc-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5 text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                        Line {code}
                      </Badge>
                      <span className="text-sm font-medium text-zinc-200 truncate">
                        {category?.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-0.5 block">
                      {items.length} {items.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white font-mono tabular-nums shrink-0">
                    {formatCurrencyPrecise(total)}
                  </span>
                </button>
                {isExpanded && (
                  <div className="bg-black/20 px-4 pb-3">
                    <div className="ml-7 space-y-1.5 pt-2">
                      {items.map((item) => {
                        const prop = properties.find((p) => p.id === item.propertyId);
                        return (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 py-1.5 px-3 rounded-lg bg-[#1a1b20] border border-white/5"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-zinc-300">{item.description}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-zinc-500">{formatDate(item.date)}</span>
                                {prop && (
                                  <>
                                    <span className="text-zinc-700 text-[11px]">·</span>
                                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                      <Building2 className="h-2.5 w-2.5" />
                                      {prop.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-medium text-zinc-300 font-mono tabular-nums shrink-0">
                              {formatCurrencyPrecise(item.amount)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Separator className="bg-white/5" />
        <div className="flex items-center justify-between px-4 py-3.5 bg-white/5">
          <span className="text-sm font-semibold text-zinc-200">Grand Total</span>
          <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
            {formatCurrencyPrecise(grandTotal)}
          </span>
        </div>
      </Card>

      <Button variant="outline" className="w-full bg-[#121317] border-white/5 text-zinc-300 hover:text-white hover:bg-white/5" onClick={() => window.print()}>
        <Download className="h-4 w-4 mr-2" />
        Export for Accountant
      </Button>
    </div>
  );
}
