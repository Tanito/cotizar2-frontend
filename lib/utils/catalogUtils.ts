import type { CatalogItemType } from "@/lib/models/catalog";

export function formatCatalogPrice(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getCatalogTypeLabel(type: CatalogItemType): string {
  return type === "product" ? "Producto" : "Servicio";
}

export function getCatalogTypeTabLabel(type: CatalogItemType): string {
  return type === "product" ? "Productos" : "Servicios";
}

