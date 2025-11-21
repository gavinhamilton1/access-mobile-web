export type CaptureHistoryItem = {
  id: string;
  title: string;
  programNumber: string;
  amount: string;
  currency: string;
  status: 'action-required' | 'deposited';
  date: string;
};

export const captureHistoryData: CaptureHistoryItem[] = [
  {
    id: '1',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '3 000 000,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '100 000,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '3',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '25,00',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-15',
  },
  {
    id: '4',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '50,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-14',
  },
  {
    id: '5',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '75,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-14',
  },
  {
    id: '6',
    title: 'CAD PROGRAM CA/USD',
    programNumber: 'Program 931503602',
    amount: '80,12',
    currency: 'USD',
    status: 'action-required',
    date: '2024-01-13',
  },
  {
    id: '7',
    title: 'CAD PROGRAM CA/CAD',
    programNumber: 'Program 931503601',
    amount: '10,11',
    currency: 'CAD',
    status: 'action-required',
    date: '2024-01-13',
  },
  {
    id: '8',
    title: 'AUTOAL1 RDC PROGRAM 1 GROUPS',
    programNumber: 'Program 15501',
    amount: '125,00',
    currency: 'USD',
    status: 'deposited',
    date: '2024-01-12',
  },
];

