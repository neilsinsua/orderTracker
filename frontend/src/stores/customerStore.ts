import {create} from 'zustand'

interface CustomerUIState {
    showAddForm: boolean;
    editCustomerID: number | null;
    setShowAddForm: (show: boolean) => void;
    setEditCustomerID: (id: number | null) => void;
}

export const useCustomerStore = create<CustomerUIState>((set) => ({
    showAddForm: false,
    editCustomerID: null,
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditCustomerID: (id) => set({ editCustomerID: id }),
}))