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
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
          <FileText className="h-4 w-4 text-white" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900">T776 Tax Report</h2>
      </div>

      {/* Property Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {propertyOptions.map((opt) => {
          const isActive = propertyFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setPropertyFilter(opt.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-zinc-600 border border-zinc-200/80 hover:border-zinc-300'
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>

      {/* Grand Total Card */}
      <Card className="border-zinc-200/80 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700/70 mb-1">Total T776 Deductions (2026 YTD)</p>
              <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                {formatCurrencyPrecise(grandTotal)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/20">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-emerald-600 border-emerald-200/60 bg-white">
              {Object.keys(groupedByCategory).length} categories
            </Badge>
            <Badge variant="outline" className="text-zinc-500 border-zinc-200/60 bg-white">
              {filteredExpenses.length} entries
            </Badge>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-zinc-200/80 shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">Expenses by T776 Line Item</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Grouped by CRA Form T776 categories</p>
        </div>
        <div className="divide-y divide-zinc-50">
          {Object.entries(groupedByCategory).map(([code, items]) => {
            const category = T776_CATEGORIES.find((c) => c.code === code);
            const total = categoryTotals[code];
            const isExpanded = expandedCategories.has(code);
            return (
              <div key={code}>
                <button
                  onClick={() => toggleCategory(code)}
                  className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-zinc-50/50 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] py-0 px-1.5 text-emerald-600 border-emerald-200/60 bg-emerald-50/50"
                      >
                        Line {code}
                      </Badge>
                      <span className="text-sm font-medium text-zinc-800 truncate">
                        {category?.label}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 mt-0.5 block">
                      {items.length} {items.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-zinc-900 font-mono tabular-nums shrink-0">
                    {formatCurrencyPrecise(total)}
                  </span>
                </button>
                {isExpanded && (
                  <div className="bg-zinc-50/30 px-5 pb-3">
                    <div className="ml-7 space-y-1.5 pt-2">
                      {items.map((item) => {
                        const prop = properties.find((p) => p.id === item.propertyId);
                        return (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 py-1.5 px-3 rounded-lg bg-white border border-zinc-100"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-zinc-700">{item.description}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-zinc-400">{formatDate(item.date)}</span>
                                {prop && (
                                  <>
                                    <span className="text-zinc-300 text-[11px]">·</span>
                                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                                      <Building2 className="h-2.5 w-2.5" />
                                      {prop.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-medium text-zinc-700 font-mono tabular-nums shrink-0">
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
        <Separator />
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-50/50">
          <span className="text-sm font-semibold text-zinc-700">Grand Total</span>
          <span className="text-lg font-bold text-emerald-700 font-mono tabular-nums">
            {formatCurrencyPrecise(grandTotal)}
          </span>
        </div>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => window.print()}>
        <Download className="h-4 w-4 mr-2" />
        Export for Accountant
      </Button>
    </div>
  );
}
