export interface Product {
  id: string;
  name: string;
  article: string;
  photo: string | null;
  hint: string;
  quantity: number;
  sellPrice: number;
  buyPrice: number;
  createdAt: string;
  contractorId?: string;
}

export interface Contractor {
  id: string;
  name: string;
  createdAt: string;
}

export interface ContractorPurchase {
  id: string;
  contractorId: string;
  productName: string;
  article: string;
  quantity: number;
  buyPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface ContractorStats {
  totalProducts: number;
  totalDebt: number;
  purchases: ContractorPurchase[];
}