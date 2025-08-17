import {create} from "zustand";

interface OrderUIState {
    showAddForm: boolean; //to display form (add mode)
    editOrderID: number | null; //to display form (edit mode)
    setShowAddForm: (show: boolean) => void;
    setEditProductID: (id: number | null) => void;
}

export const useOrderStore = create<OrderUIState>((set) => ({
    showAddForm: false,
    editOrderID: null,
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditProductID: (id) => set({ editOrderID: id }),
}))