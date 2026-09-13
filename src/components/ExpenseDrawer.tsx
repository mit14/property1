import { useState, useEffect } from 'react';
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
  const [propertyId, setPropertyId] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [description, setDescription] = useState('');
  const [hasReceipt, setHasReceipt] = useState(false);

  useEffect(() => {
    if (open && properties.length > 0 && !propertyId) {
      setPropertyId(properties[0].id);
    }
  }, [open, properties, propertyId]);

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
      <button
        onClick={() => onOpenChange(true)}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all"
        aria-label="Add Expense"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[88vh] bg-[#121317] border-white/10">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
                <Receipt className="h-4 w-4 text-white" />
              </div>
              Log T776 Expense
            </DrawerTitle>
            <DrawerDescription className="text-zinc-500">
              Track a deductible expense for CRA Form T776
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-zinc-500">Amount ($)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">$</span>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7 font-mono tabular-nums text-base h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-zinc-500">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white [color-scheme:dark]"
                />
              </div>

              <div>
                <Label className="text-xs text-zinc-500">Property</Label>
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1b20] border-white/10">
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-500">CRA T776 Category</Label>
                <Select value={categoryCode} onValueChange={setCategoryCode}>
                  <SelectTrigger className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white">
                    <SelectValue placeholder="Select T776 line item" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1b20] border-white/10 max-h-64">
                    <SelectGroup>
                      <SelectLabel className="text-xs text-zinc-500">Form T776 — Rental Expenses</SelectLabel>
                      {T776_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.code} value={cat.code}>
                          <span className="font-mono text-emerald-400 mr-2 text-xs">L{cat.code}</span>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-zinc-500">Description (optional)</Label>
                <Input
                  placeholder="e.g. Furnace repair — parts & labor"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 h-11 bg-[#1a1b20] border-white/5 text-white placeholder:text-zinc-600"
                />
              </div>

              <div>
                <Label className="text-xs text-zinc-500">Receipt Image</Label>
                <button
                  onClick={() => setHasReceipt(!hasReceipt)}
                  className={`mt-1 flex w-full items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-all ${
                    hasReceipt
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  {hasReceipt ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Check className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-emerald-400">Receipt attached</p>
                        <p className="text-xs text-emerald-600/70">receipt_2026.jpg · 1.2 MB</p>
                      </div>
                      <X className="h-4 w-4 text-emerald-600" />
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                        <Upload className="h-5 w-5 text-zinc-500" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-zinc-400">Upload receipt</p>
                        <p className="text-xs text-zinc-600">Tap to attach a photo or PDF</p>
                      </div>
                      <ImageIcon className="h-4 w-4 text-zinc-700" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1 h-11 bg-[#1a1b20] border-white/5 text-zinc-300 hover:text-white hover:bg-white/5" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20" onClick={handleSubmit}>
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
