import {create} from 'zustand'

interface CustomerUIState {
    showAddForm: boolean;
    editCustomer: number | null;
    setShowAddForm: (show: boolean) => void;
    setEditCustomer: (id: number | null) => void;
}

export const useCustomerStore = create<CustomerUIState>((set) => ({
    showAddForm: false,
    editCustomer: null,
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditCustomer: (id) => set({ editCustomer: id }),
}))