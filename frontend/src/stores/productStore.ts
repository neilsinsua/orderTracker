import {create} from "zustand";

interface ProductUIState {
    showAddForm: boolean;
    editProductID: number | null;
    productFormSku: string;
    productFormName: string;
    productFormUnit_price: number;
    productFormStock_level: number;
    setShowAddForm: (show: boolean) => void;
    setEditProductID: (id: number | null) => void;
    setProductFormSku: (sku: string) => void;
    setProductFormName: (name: string) => void;
    setProductFormUnit_price: (unit_price: number) => void;
    setProductFormStock_level: (stock_level: number) => void;
}

export const useProductStore = create<ProductUIState>((set) => ({
    showAddForm: false,
    editProductID: null,
    productFormSku: "",
    productFormName: "",
    productFormUnit_price: 0,
    productFormStock_level: 0,
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditProductID: (id) => set({ editProductID: id }),
    setProductFormSku: (sku) => set({ productFormSku: sku }),
    setProductFormName: (name) => set({ productFormName: name }),
    setProductFormUnit_price: (unit_price) => set({ productFormUnit_price: unit_price }),
    setProductFormStock_level: (stock_level) => set({ productFormStock_level: stock_level }),
}))