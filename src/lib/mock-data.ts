import type { Property, Tenant, RentPayment, STRPayout, Expense, ActivityItem } from './types';

export const properties: Property[] = [
  {
    id: 'prop-ltr-1',
    name: '144 King St - Unit A',
    address: '144 King Street W, Toronto, ON M5H 1H2',
    type: 'LTR',
  },
  {
    id: 'prop-str-1',
    name: 'Blue Mountain Chalet',
    address: '28 Mountain Resort Dr, Blue Mountains, ON L9Y 0R9',
    type: 'STR',
  },
];

export const tenants: Record<string, Tenant> = {
  'prop-ltr-1': {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '(416) 555-0142',
    monthlyRent: 2450,
    leaseStart: '2025-09-01',
    leaseEnd: '2026-08-31',
    lmrDeposit: 2450,
    status: 'Paid',
  },
};

export const rentPayments: RentPayment[] = [
  { id: 'rp-1', propertyId: 'prop-ltr-1', month: '2026-01', amount: 2450, method: 'e-Transfer', status: 'Paid', date: '2026-01-03' },
  { id: 'rp-2', propertyId: 'prop-ltr-1', month: '2026-02', amount: 2450, method: 'e-Transfer', status: 'Paid', date: '2026-02-02' },
  { id: 'rp-3', propertyId: 'prop-ltr-1', month: '2026-03', amount: 2450, method: 'e-Transfer', status: 'Paid', date: '2026-03-01' },
  { id: 'rp-4', propertyId: 'prop-ltr-1', month: '2026-04', amount: 2450, method: 'Cheque', status: 'Paid', date: '2026-04-04' },
  { id: 'rp-5', propertyId: 'prop-ltr-1', month: '2026-05', amount: 2450, method: 'e-Transfer', status: 'Paid', date: '2026-05-02' },
  { id: 'rp-6', propertyId: 'prop-ltr-1', month: '2026-06', amount: 2450, method: 'e-Transfer', status: 'Paid', date: '2026-06-01' },
  { id: 'rp-7', propertyId: 'prop-ltr-1', month: '2026-07', amount: 2450, method: 'e-Transfer', status: 'Paid', date: '2026-07-03' },
  { id: 'rp-8', propertyId: 'prop-ltr-1', month: '2026-08', amount: 2450, method: 'e-Transfer', status: 'Pending', date: '2026-08-01' },
];

export const strPayouts: STRPayout[] = [
  { id: 'sp-1', propertyId: 'prop-str-1', date: '2026-01-15', grossBooking: 3200, platformFee: 480, cleaningFee: 150, netPayout: 2870 },
  { id: 'sp-2', propertyId: 'prop-str-1', date: '2026-02-10', grossBooking: 4100, platformFee: 615, cleaningFee: 200, netPayout: 3685 },
  { id: 'sp-3', propertyId: 'prop-str-1', date: '2026-03-20', grossBooking: 2800, platformFee: 420, cleaningFee: 150, netPayout: 2530 },
  { id: 'sp-4', propertyId: 'prop-str-1', date: '2026-04-12', grossBooking: 3500, platformFee: 525, cleaningFee: 175, netPayout: 3150 },
  { id: 'sp-5', propertyId: 'prop-str-1', date: '2026-05-18', grossBooking: 5200, platformFee: 780, cleaningFee: 250, netPayout: 4670 },
  { id: 'sp-6', propertyId: 'prop-str-1', date: '2026-06-08', grossBooking: 6100, platformFee: 915, cleaningFee: 300, netPayout: 5485 },
  { id: 'sp-7', propertyId: 'prop-str-1', date: '2026-07-22', grossBooking: 5800, platformFee: 870, cleaningFee: 275, netPayout: 5205 },
  { id: 'sp-8', propertyId: 'prop-str-1', date: '2026-08-05', grossBooking: 4900, platformFee: 735, cleaningFee: 225, netPayout: 4390 },
];

export const expenses: Expense[] = [
  { id: 'ex-1', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-01-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'January mortgage payment interest portion', hasReceipt: true },
  { id: 'ex-2', propertyId: 'prop-ltr-1', amount: 320, date: '2026-01-20', category: 'Utilities', categoryCode: '9220', description: 'Hydro & gas - January', hasReceipt: true },
  { id: 'ex-3', propertyId: 'prop-ltr-1', amount: 145, date: '2026-02-03', category: 'Maintenance & Repairs', categoryCode: '8960', description: 'Kitchen faucet replacement', hasReceipt: true },
  { id: 'ex-4', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-02-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'February mortgage payment interest portion', hasReceipt: false },
  { id: 'ex-5', propertyId: 'prop-ltr-1', amount: 285, date: '2026-02-20', category: 'Utilities', categoryCode: '9220', description: 'Hydro & gas - February', hasReceipt: true },
  { id: 'ex-6', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-03-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'March mortgage payment interest portion', hasReceipt: true },
  { id: 'ex-7', propertyId: 'prop-ltr-1', amount: 410, date: '2026-03-18', category: 'Insurance', categoryCode: '8690', description: 'Property insurance quarterly premium', hasReceipt: true },
  { id: 'ex-8', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-04-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'April mortgage payment interest portion', hasReceipt: true },
  { id: 'ex-9', propertyId: 'prop-ltr-1', amount: 310, date: '2026-04-20', category: 'Utilities', categoryCode: '9220', description: 'Hydro & gas - April', hasReceipt: true },
  { id: 'ex-10', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-05-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'May mortgage payment interest portion', hasReceipt: true },
  { id: 'ex-11', propertyId: 'prop-ltr-1', amount: 295, date: '2026-05-20', category: 'Utilities', categoryCode: '9220', description: 'Hydro & gas - May', hasReceipt: true },
  { id: 'ex-12', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-06-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'June mortgage payment interest portion', hasReceipt: true },
  { id: 'ex-13', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-07-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'July mortgage payment interest portion', hasReceipt: true },
  { id: 'ex-14', propertyId: 'prop-ltr-1', amount: 1850, date: '2026-08-15', category: 'Mortgage Interest & Bank Charges', categoryCode: '8710', description: 'August mortgage payment interest portion', hasReceipt: false },
  { id: 'ex-15', propertyId: 'prop-ltr-1', amount: 320, date: '2026-06-20', category: 'Utilities', categoryCode: '9220', description: 'Hydro & gas - June', hasReceipt: true },
  { id: 'ex-16', propertyId: 'prop-ltr-1', amount: 310, date: '2026-07-20', category: 'Utilities', categoryCode: '9220', description: 'Hydro & gas - July', hasReceipt: true },
  { id: 'ex-17', propertyId: 'prop-ltr-1', amount: 280, date: '2026-08-20', category: 'Utilities', categoryCode: '9220', description: 'Hydro & gas - August', hasReceipt: true },
  { id: 'ex-18', propertyId: 'prop-ltr-1', amount: 6200, date: '2026-03-01', category: 'Property Taxes', categoryCode: '9180', description: '2026 property tax installment', hasReceipt: true },
  { id: 'ex-19', propertyId: 'prop-ltr-1', amount: 450, date: '2026-05-10', category: 'Professional Fees - Legal/Accounting', categoryCode: '8860', description: 'Bookkeeping & tax filing services', hasReceipt: true },
  { id: 'ex-20', propertyId: 'prop-ltr-1', amount: 75, date: '2026-06-05', category: 'Advertising', categoryCode: '8521', description: 'Rental listing renewal - Realtor.ca', hasReceipt: false },

  { id: 'ex-21', propertyId: 'prop-str-1', amount: 850, date: '2026-01-10', category: 'Maintenance & Repairs', categoryCode: '8960', description: 'Hot tub servicing & filter replacement', hasReceipt: true },
  { id: 'ex-22', propertyId: 'prop-str-1', amount: 220, date: '2026-01-15', category: 'Other - Guest Supplies & Platform Fees', categoryCode: '9270', description: 'Welcome baskets & guest amenities', hasReceipt: false },
  { id: 'ex-23', propertyId: 'prop-str-1', amount: 380, date: '2026-02-05', category: 'Utilities', categoryCode: '9220', description: 'Propane heating - winter season', hasReceipt: true },
  { id: 'ex-24', propertyId: 'prop-str-1', amount: 1200, date: '2026-02-20', category: 'Insurance', categoryCode: '8690', description: 'Short-term rental insurance policy', hasReceipt: true },
  { id: 'ex-25', propertyId: 'prop-str-1', amount: 340, date: '2026-03-10', category: 'Other - Guest Supplies & Platform Fees', categoryCode: '9270', description: 'Cleaning supplies & linens restock', hasReceipt: true },
  { id: 'ex-26', propertyId: 'prop-str-1', amount: 650, date: '2026-03-25', category: 'Maintenance & Repairs', categoryCode: '8960', description: 'Deck repair & staining', hasReceipt: true },
  { id: 'ex-27', propertyId: 'prop-str-1', amount: 420, date: '2026-04-15', category: 'Other - Guest Supplies & Platform Fees', categoryCode: '9270', description: 'Guest welcome supplies Q1', hasReceipt: false },
  { id: 'ex-28', propertyId: 'prop-str-1', amount: 290, date: '2026-05-10', category: 'Utilities', categoryCode: '9220', description: 'Internet & streaming services', hasReceipt: true },
  { id: 'ex-29', propertyId: 'prop-str-1', amount: 890, date: '2026-05-20', category: 'Maintenance & Repairs', categoryCode: '8960', description: 'HVAC annual service', hasReceipt: true },
  { id: 'ex-30', propertyId: 'prop-str-1', amount: 380, date: '2026-06-10', category: 'Other - Guest Supplies & Platform Fees', categoryCode: '9270', description: 'Summer guest amenities', hasReceipt: false },
  { id: 'ex-31', propertyId: 'prop-str-1', amount: 520, date: '2026-06-25', category: 'Travel / Mileage', categoryCode: '9200', description: 'Property visit - mileage & fuel', hasReceipt: true },
  { id: 'ex-32', propertyId: 'prop-str-1', amount: 450, date: '2026-07-10', category: 'Other - Guest Supplies & Platform Fees', categoryCode: '9270', description: 'Guest supplies restock', hasReceipt: true },
  { id: 'ex-33', propertyId: 'prop-str-1', amount: 310, date: '2026-07-15', category: 'Utilities', categoryCode: '9220', description: 'Internet & utilities - July', hasReceipt: true },
  { id: 'ex-34', propertyId: 'prop-str-1', amount: 720, date: '2026-08-05', category: 'Maintenance & Repairs', categoryCode: '8960', description: 'Pressure washing & exterior cleanup', hasReceipt: true },
  { id: 'ex-35', propertyId: 'prop-str-1', amount: 390, date: '2026-08-10', category: 'Other - Guest Supplies & Platform Fees', categoryCode: '9270', description: 'August guest supplies', hasReceipt: false },
  { id: 'ex-36', propertyId: 'prop-str-1', amount: 320, date: '2026-08-15', category: 'Utilities', categoryCode: '9220', description: 'Internet & utilities - August', hasReceipt: true },
];

export function buildActivityFeed(): ActivityItem[] {
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
}
