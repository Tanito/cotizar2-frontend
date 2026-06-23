export type CatalogItemType = "product" | "service";

export type CatalogItem = {
  id: string;
  type: CatalogItemType;
  name: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

