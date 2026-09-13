import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import {
  properties as mockProperties,
  tenants as mockTenants,
  rentPayments as mockRentPayments,
  strPayouts as mockStrPayouts,
  expenses as mockExpenses,
  buildActivityFeed,
} from '@/lib/mock-data';
import type { Property, RentPayment, STRPayout, Expense, ActivityItem } from '@/lib/types';

export interface TenantInfo {
  name: string;
  email: string;
  phone: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  lmrDeposit: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface DataContextValue {
  properties: Property[];
  rentPayments: RentPayment[];
  strPayouts: STRPayout[];
  expenses: Expense[];
  tenants: Record<string, TenantInfo>;
  activityFeed: ActivityItem[];
  loading: boolean;
  addProperty: (property: Omit<Property, 'id'> & Partial<Record<string, unknown>>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  addSTRPayout: (payout: Omit<STRPayout, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { session, user, isDemoMode } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [strPayouts, setStrPayouts] = useState<STRPayout[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tenants, setTenants] = useState<Record<string, TenantInfo>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!session?.user) {
      setProperties(mockProperties);
      setRentPayments(mockRentPayments);
      setStrPayouts(mockStrPayouts);
      setExpenses(mockExpenses);
      setTenants(mockTenants as Record<string, TenantInfo>);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userId = user!.id;

    const [propsRes, rentRes, strRes, expRes] = await Promise.all([
      supabase.from('properties').select('*').eq('user_id', userId),
      supabase.from('rent_payments').select('*').eq('user_id', userId),
      supabase.from('str_payouts').select('*').eq('user_id', userId),
      supabase.from('expenses').select('*').eq('user_id', userId),
    ]);

    const dbProperties: Property[] = (propsRes.data ?? []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      name: p.name as string,
      address: `${p.address as string}, ${p.city as string}, ${p.province as string} ${p.postal_code as string}`,
      type: p.type as 'LTR' | 'STR',
    }));

    const dbTenants: Record<string, TenantInfo> = {};
    (propsRes.data ?? []).forEach((p: Record<string, unknown>) => {
      if (p.type === 'LTR' && p.tenant_name) {
        dbTenants[p.id as string] = {
          name: p.tenant_name as string,
          email: (p.tenant_email as string) ?? '',
          phone: (p.tenant_phone as string) ?? '',
          monthlyRent: Number(p.monthly_rent ?? 0),
          leaseStart: (p.lease_start as string) ?? '',
          leaseEnd: (p.lease_end as string) ?? '',
          lmrDeposit: Number(p.lmr_deposit ?? 0),
          status: 'Pending' as const,
        };
      }
    });

    const dbRentPayments: RentPayment[] = (rentRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      propertyId: r.property_id as string,
      month: r.month as string,
      amount: Number(r.amount ?? 0),
      method: r.method as 'e-Transfer' | 'Cheque',
      status: r.status as 'Paid' | 'Pending' | 'Overdue',
      date: r.date as string,
    }));

    const dbSTRPayouts: STRPayout[] = (strRes.data ?? []).map((s: Record<string, unknown>) => ({
      id: s.id as string,
      propertyId: s.property_id as string,
      date: s.date as string,
      grossBooking: Number(s.gross_booking ?? 0),
      platformFee: Number(s.platform_fee ?? 0),
      cleaningFee: Number(s.cleaning_fee ?? 0),
      netPayout: Number(s.net_payout ?? 0),
    }));

    const dbExpenses: Expense[] = (expRes.data ?? []).map((e: Record<string, unknown>) => ({
      id: e.id as string,
      propertyId: e.property_id as string,
      amount: Number(e.amount ?? 0),
      date: e.date as string,
      category: e.category as string,
      categoryCode: e.category_code as string,
      description: e.description as string,
      hasReceipt: Boolean(e.has_receipt),
    }));

    setProperties(dbProperties.length > 0 ? dbProperties : mockProperties);
    setTenants(Object.keys(dbTenants).length > 0 ? dbTenants : (mockTenants as Record<string, TenantInfo>));
    setRentPayments(dbRentPayments.length > 0 ? dbRentPayments : mockRentPayments);
    setStrPayouts(dbSTRPayouts.length > 0 ? dbSTRPayouts : mockStrPayouts);
    setExpenses(dbExpenses.length > 0 ? dbExpenses : mockExpenses);
    setLoading(false);
  }, [session, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addProperty = useCallback(
    async (property: Omit<Property, 'id'> & Partial<Record<string, unknown>>) => {
      if (!session?.user) {
        const newProp: Property = {
          id: `prop-${Date.now()}`,
          name: property.name,
          address: property.address ?? '',
          type: property.type as 'LTR' | 'STR',
        };
        setProperties((prev) => [...prev, newProp]);
        if (property.type === 'LTR' && property.tenant_name) {
          setTenants((prev) => ({
            ...prev,
            [newProp.id]: {
              name: property.tenant_name as string,
              email: (property.tenant_email as string) ?? '',
              phone: (property.tenant_phone as string) ?? '',
              monthlyRent: Number(property.monthly_rent ?? 0),
              leaseStart: (property.lease_start as string) ?? '',
              leaseEnd: (property.lease_end as string) ?? '',
              lmrDeposit: Number(property.lmr_deposit ?? property.monthly_rent ?? 0),
              status: 'Pending' as const,
            },
          }));
        }
        return;
      }

      const insertData: Record<string, unknown> = {
        name: property.name,
        address: property.address ?? '',
        city: property.city ?? '',
        postal_code: property.postal_code ?? '',
        province: property.province ?? 'ON',
        type: property.type,
      };

      if (property.type === 'LTR') {
        insertData.tenant_name = property.tenant_name ?? null;
        insertData.tenant_email = property.tenant_email ?? null;
        insertData.tenant_phone = property.tenant_phone ?? null;
        insertData.monthly_rent = property.monthly_rent ?? 0;
        insertData.lease_start = property.lease_start ?? null;
        insertData.lease_end = property.lease_end ?? null;
        insertData.lmr_deposit = property.lmr_deposit ?? property.monthly_rent ?? 0;
      } else {
        insertData.nightly_rate = property.nightly_rate ?? 0;
        insertData.cleaning_fee = property.cleaning_fee ?? 0;
        insertData.str_license = property.str_license ?? null;
      }

      const { data, error } = await supabase.from('properties').insert(insertData).select().single();
      if (error) {
        console.error('Error adding property:', error);
        return;
      }

      await loadData();
    },
    [session, loadData]
  );

  const addExpense = useCallback(
    async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
      if (!session?.user) {
        const newExp: Expense = {
          ...expense,
          id: `ex-${Date.now()}`,
        };
        setExpenses((prev) => [newExp, ...prev]);
        return;
      }

      const { error } = await supabase.from('expenses').insert({
        property_id: expense.propertyId,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        category_code: expense.categoryCode,
        description: expense.description,
        has_receipt: expense.hasReceipt,
      });

      if (error) {
        console.error('Error adding expense:', error);
        return;
      }

      await loadData();
    },
    [session, loadData]
  );

  const addSTRPayout = useCallback(
    async (payout: Omit<STRPayout, 'id' | 'user_id' | 'created_at'>) => {
      if (!session?.user) {
        const newPayout: STRPayout = {
          ...payout,
          id: `sp-${Date.now()}`,
        };
        setStrPayouts((prev) => [newPayout, ...prev]);
        return;
      }

      const { error } = await supabase.from('str_payouts').insert({
        property_id: payout.propertyId,
        date: payout.date,
        gross_booking: payout.grossBooking,
        platform_fee: payout.platformFee,
        cleaning_fee: payout.cleaningFee,
        net_payout: payout.netPayout,
      });

      if (error) {
        console.error('Error adding STR payout:', error);
        return;
      }

      await loadData();
    },
    [session, loadData]
  );

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const activityFeed = buildActivityFeed();

  return (
    <DataContext.Provider
      value={{
        properties,
        rentPayments,
        strPayouts,
        expenses,
        tenants,
        activityFeed,
        loading,
        addProperty,
        addExpense,
        addSTRPayout,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
