export type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    assignedTo: string;
    createdAt: string;
  };