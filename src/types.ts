export type Role = 'ADMIN' | 'KASIR';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain: string | null;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  tenantId: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  tenantId: string;
}

export interface Transaction {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  userId: string;
  tenantId: string;
  createdAt: string; // ISO date string
}
