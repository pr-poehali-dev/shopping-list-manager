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
}
