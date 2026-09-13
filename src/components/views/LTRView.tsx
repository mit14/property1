import { useState } from 'react';
import {
  Home,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  ShieldCheck,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatCurrency, formatCurrencyPrecise, formatDate, formatMonthYear } from '@/lib/format';
import { useData, type TenantInfo } from '@/contexts/DataContext';
import type { PaymentStatus, Property, RentPayment } from '@/lib/types';

const statusConfig: Record<PaymentStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  Overdue: { bg: 'bg-rose-50', text: 'text-rose-700', icon: AlertCircle },
};

export function LTRView() {
  const { properties, tenants, rentPayments } = useData();
  const ltrProperties = properties.filter((p) => p.type === 'LTR');

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
          <Home className="h-4 w-4 text-white" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900">Long-Term Rentals</h2>
      </div>

      {ltrProperties.length === 0 && (
        <Card className="border-zinc-200/80 shadow-sm">
          <div className="p-8 text-center">
            <Home className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">No long-term rental properties yet.</p>
            <p className="text-xs text-zinc-400 mt-1">Use "Add Property" to create one.</p>
          </div>
        </Card>
      )}

      {ltrProperties.map((property) => {
        const tenant = tenants[property.id];
        const payments = rentPayments.filter((r) => r.propertyId === property.id);
        if (!tenant) {
          return (
            <Card key={property.id} className="border-zinc-200/80 shadow-sm">
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-zinc-900">{property.name}</h3>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60">Long-Term</Badge>
                </div>
                <p className="text-sm text-zinc-400">{property.address}</p>
                <p className="text-xs text-amber-500 mt-3">No tenant assigned yet.</p>
              </div>
            </Card>
          );
        }
        return (
          <TenantSection
            key={property.id}
            property={property}
            tenant={tenant}
            payments={payments}
          />
        );
      })}
    </div>
  );
}

function TenantSection({
  property,
  tenant,
  payments,
}: {
  property: Property;
  tenant: TenantInfo;
  payments: RentPayment[];
}) {
  const StatusIcon = statusConfig[tenant.status].icon;
  const totalPaid = payments.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      {/* Tenant & Unit Card */}
      <Card className="border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-zinc-900">{property.name}</h3>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-50">
                  Long-Term
                </Badge>
              </div>
              <p className="text-sm text-zinc-400">{property.address}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig[tenant.status].bg}`}>
              <StatusIcon className={`h-3.5 w-3.5 ${statusConfig[tenant.status].text}`} />
              <span className={`text-xs font-medium ${statusConfig[tenant.status].text}`}>
                {tenant.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={User} label="Tenant" value={tenant.name} />
            <InfoRow icon={Mail} label="Email" value={tenant.email} />
            <InfoRow icon={Phone} label="Phone" value={tenant.phone} />
            <InfoRow icon={Calendar} label="Lease" value={`${formatDate(tenant.leaseStart)} → ${formatDate(tenant.leaseEnd)}`} />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-zinc-50 p-3">
              <p className="text-xs text-zinc-400 mb-1">Monthly Rent</p>
              <p className="text-lg font-bold text-zinc-900 font-mono tabular-nums">
                {formatCurrencyPrecise(tenant.monthlyRent)}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <p className="text-xs text-zinc-400">Last Month's Rent (LMR)</p>
              </div>
              <p className="text-lg font-bold text-zinc-900 font-mono tabular-nums">
                {formatCurrencyPrecise(tenant.lmrDeposit)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Deposit & Rent Ledger */}
      <Card className="border-zinc-200/80 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-900">Rent Ledger</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono tabular-nums">
            {formatCurrency(totalPaid)} collected
          </span>
        </div>
        <div className="divide-y divide-zinc-50">
          {payments.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-zinc-400">No rent payments logged yet.</p>
            </div>
          )}
          {payments.map((payment) => {
            const cfg = statusConfig[payment.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={payment.id} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg} shrink-0`}>
                  <StatusIcon className={`h-4 w-4 ${cfg.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800">{formatMonthYear(payment.month)}</p>
                  <p className="text-xs text-zinc-400">{payment.method}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-zinc-900 font-mono tabular-nums">
                    {formatCurrencyPrecise(payment.amount)}
                  </p>
                  <span className={`text-[10px] font-medium ${cfg.text}`}>{payment.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Rent Receipt Action */}
      <RentReceiptDialog property={property} tenant={tenant} totalPaid={totalPaid} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-50 shrink-0">
        <Icon className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-zinc-400">{label}</p>
        <p className="text-sm text-zinc-700 truncate">{value}</p>
      </div>
    </div>
  );
}

function RentReceiptDialog({
  property,
  tenant,
  totalPaid,
}: {
  property: Property;
  tenant: TenantInfo;
  totalPaid: number;
}) {
  const [open, setOpen] = useState(false);
  const landlordName = 'Property Owner';
  const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
          size="lg"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Annual Rent Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-zinc-900">
            Official Rent Receipt
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 print:shadow-none print:border-zinc-300">
          <div className="text-center mb-5">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-emerald-600 mb-3">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">RENT RECEIPT</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Province of Ontario · 2026 Tax Year</p>
          </div>

          <div className="space-y-3 text-sm">
            <ReceiptLine label="Landlord" value={landlordName} />
            <ReceiptLine label="Tenant" value={tenant.name} />
            <ReceiptLine label="Property Address" value={property.address} />
            <ReceiptLine label="Unit" value={property.name} />
            <ReceiptLine label="Lease Period" value={`${formatDate(tenant.leaseStart)} – ${formatDate(tenant.leaseEnd)}`} />
            <Separator className="my-3" />
            <div className="flex items-center justify-between py-2 bg-emerald-50 rounded-lg px-3">
              <span className="text-sm font-medium text-emerald-800">Total Rent Paid (2026 YTD)</span>
              <span className="text-lg font-bold text-emerald-700 font-mono tabular-nums">
                {formatCurrencyPrecise(totalPaid)}
              </span>
            </div>
            <Separator className="my-3" />
            <ReceiptLine label="Date Issued" value={today} />
          </div>

          <div className="mt-8 pt-4 border-t border-dashed border-zinc-200">
            <p className="text-xs text-zinc-400 mb-1">Landlord Signature</p>
            <div className="h-10 border-b border-zinc-200" />
            <p className="text-xs text-zinc-400 mt-2">{landlordName}</p>
          </div>

          <p className="text-[10px] text-zinc-300 mt-5 text-center leading-relaxed">
            This receipt is issued for income tax purposes pursuant to the Ontario Residential
            Tenancies Act. Retain this document for your records.
          </p>
        </div>

        <Button
          className="w-full mt-2"
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-zinc-400 text-xs shrink-0 pt-0.5">{label}</span>
      <span className="text-zinc-800 font-medium text-right">{value}</span>
    </div>
  );
}
