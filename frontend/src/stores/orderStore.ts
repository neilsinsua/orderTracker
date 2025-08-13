import {create} from "zustand";

interface OrderUIState {
    showAddForm: boolean; //to display form (add mode)
    editOrderID: number | null; //to display form (edit mode)
    customerSearch: string;
    productSearch: string;
    setShowAddForm: (show: boolean) => void;
    setEditProductID: (id: number | null) => void;
    setCustomerSearch: (term: string) => void;
    setProductSearch: (term: string) => void;
}

export const useOrderStore = create<OrderUIState>((set) => ({
    showAddForm: false,
    editOrderID: null,
    customerSearch: "",
    productSearch: "",
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditProductID: (id) => set({ editOrderID: id }),
    setCustomerSearch: (term) => set({ customerSearch: term }),
    setProductSearch: (term) => set({ productSearch: term }),
}))