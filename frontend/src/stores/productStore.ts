import {create} from "zustand";

interface ProductUIState {
    showAddForm: boolean; // to display form (add mode)
    editProductID: number | null; // to display form (edit mode)
    setShowAddForm: (show: boolean) => void;
    setEditProductID: (id: number | null) => void;
}

export const useProductStore = create<ProductUIState>((set) => ({
    showAddForm: false,
    editProductID: null,
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditProductID: (id) => set({ editProductID: id }),
}))