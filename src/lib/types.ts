export type PropertyType = 'LTR' | 'STR';

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export type PaymentMethod = 'e-Transfer' | 'Cheque';

export type ActivityType = 'rent' | 'airbnb_payout' | 'expense';

export interface Property {
  id: string;
  name: string;
  address: string;
  type: PropertyType;
}

export interface Tenant {
  name: string;
  email: string;
  phone: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  lmrDeposit: number;
  status: PaymentStatus;
}

export interface RentPayment {
  id: string;
  propertyId: string;
  month: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
}

export interface STRPayout {
  id: string;
  propertyId: string;
  date: string;
  grossBooking: number;
  platformFee: number;
  cleaningFee: number;
  netPayout: number;
}

export interface Expense {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  category: string;
  categoryCode: string;
  description: string;
  hasReceipt: boolean;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  propertyId: string;
  description: string;
  amount: number;
  date: string;
  categoryCode?: string;
  hasReceipt: boolean;
}

export interface T776Category {
  code: string;
  label: string;
}

export const T776_CATEGORIES: T776Category[] = [
  { code: '8521', label: 'Advertising' },
  { code: '8690', label: 'Insurance' },
  { code: '8710', label: 'Mortgage Interest & Bank Charges' },
  { code: '8810', label: 'Office Expenses' },
  { code: '8860', label: 'Professional Fees - Legal/Accounting' },
  { code: '8871', label: 'Management & Admin Fees' },
  { code: '8960', label: 'Maintenance & Repairs' },
  { code: '9180', label: 'Property Taxes' },
  { code: '9200', label: 'Travel / Mileage' },
  { code: '9220', label: 'Utilities' },
  { code: '9270', label: 'Other - Guest Supplies & Platform Fees' },
];

export const STR_THRESHOLD = 30000;
