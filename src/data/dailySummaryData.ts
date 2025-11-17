export type DailySummaryItem = {
  id: string;
  date: string;
  depositsCount: number;
  currency: string;
  totalValue: string;
};

export const dailySummaryData: DailySummaryItem[] = [
  { id: '1', date: '10/15/25', depositsCount: 0, currency: 'USD', totalValue: '0,00' },
  { id: '2', date: '10/14/25', depositsCount: 0, currency: 'USD', totalValue: '0,00' },
  { id: '3', date: '10/13/25', depositsCount: 1, currency: 'USD', totalValue: '10,11' },
  { id: '4', date: '10/12/25', depositsCount: 0, currency: 'USD', totalValue: '0,00' },
  { id: '5', date: '10/11/25', depositsCount: 2, currency: 'USD', totalValue: '388,12' },
  { id: '6', date: '10/10/25', depositsCount: 1, currency: 'USD', totalValue: '2,00' },
  { id: '7', date: '10/09/25', depositsCount: 0, currency: 'USD', totalValue: '0,00' },
  { id: '8', date: '10/08/25', depositsCount: 0, currency: 'USD', totalValue: '0,00' },
  { id: '9', date: '10/07/25', depositsCount: 0, currency: 'USD', totalValue: '0,00' },
];

