import { useState } from 'react';
import { Plus, X, Upload, Image as ImageIcon, Check, Receipt } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { T776_CATEGORIES } from '@/lib/types';
import type { Expense } from '@/lib/types';

interface ExpenseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDrawer({ open, onOpenChange }: ExpenseDrawerProps) {
  const { properties, addExpense } = useData();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? '');
  const [categoryCode, setCategoryCode] = useState('');
  const [description, setDescription] = useState('');
  const [hasReceipt, setHasReceipt] = useState(false);

  const resetForm = () => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPropertyId(properties[0]?.id ?? '');
    setCategoryCode('');
    setDescription('');
    setHasReceipt(false);
  };

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      toast({ title: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    if (!categoryCode) {
      toast({ title: 'Please select a T776 category', variant: 'destructive' });
      return;
    }

    const category = T776_CATEGORIES.find((c) => c.code === categoryCode);
    const expense: Omit<Expense, 'id' | 'user_id' | 'created_at'> = {
      propertyId,
      amount: amt,
      date,
      category: category?.label ?? '',
      categoryCode,
      description: description || category?.label || 'Expense',
      hasReceipt,
    };

    await addExpense(expense);
    toast({ title: 'Expense logged', description: `${category?.label} — $${amt.toFixed(2)}` });
    resetForm();
    onOpenChange(false);
  };

  return (
    <>
      {/* Floating Add Expense Button */}
      <button
        onClick={() => onOpenChange(true)}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all"
        aria-label="Add Expense"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[88vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
                <Receipt className="h-4 w-4 text-white" />
              </div>
              Log T776 Expense
            </DrawerTitle>
            <DrawerDescription>
              Track a deductible expense for CRA Form T776
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Amount */}
              <div>
                <Label className="text-xs text-zinc-500">Amount ($)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-mono">$</span>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7 font-mono tabular-nums text-base h-11"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <Label className="text-xs text-zinc-500">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-11"
                />
              </div>

              {/* Property Selector */}
              <div>
                <Label className="text-xs text-zinc-500">Property</Label>
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* T776 Category */}
              <div>
                <Label className="text-xs text-zinc-500">CRA T776 Category</Label>
                <Select value={categoryCode} onValueChange={setCategoryCode}>
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue placeholder="Select T776 line item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-xs text-zinc-400 font-semibold">
                        Form T776 — Rental Property Expenses
                      </SelectLabel>
                      {T776_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.code} value={cat.code}>
                          <span className="font-mono text-emerald-600 mr-2 text-xs">L{cat.code}</span>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-zinc-500">Description (optional)</Label>
                <Input
                  placeholder="e.g. Furnace repair — parts & labor"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 h-11"
                />
              </div>

              {/* Receipt Upload */}
              <div>
                <Label className="text-xs text-zinc-500">Receipt Image</Label>
                <button
                  onClick={() => setHasReceipt(!hasReceipt)}
                  className={`mt-1 flex w-full items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-all ${
                    hasReceipt
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-300'
                  }`}
                >
                  {hasReceipt ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                        <Check className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-emerald-700">Receipt attached</p>
                        <p className="text-xs text-emerald-600/70">receipt_2026.jpg · 1.2 MB</p>
                      </div>
                      <X className="h-4 w-4 text-emerald-400" />
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                        <Upload className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-zinc-600">Upload receipt</p>
                        <p className="text-xs text-zinc-400">Tap to attach a photo or PDF</p>
                      </div>
                      <ImageIcon className="h-4 w-4 text-zinc-300" />
                    </>
                  )}
                </button>
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
                  onClick={handleSubmit}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Expense
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
