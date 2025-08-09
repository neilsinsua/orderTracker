import {create} from 'zustand'

interface CustomerUIState {
    showAddForm: boolean;
    editCustomerID: number | null;
    customerFormName: string;
    customerFormEmail: string;
    setShowAddForm: (show: boolean) => void;
    setEditCustomerID: (id: number | null) => void;
    setCustomerFormName: (name: string) => void;
    setCustomerFormEmail: (email: string) => void;
}

export const useCustomerStore = create<CustomerUIState>((set) => ({
    showAddForm: false,
    editCustomerID: null,
    customerFormName: "",
    customerFormEmail: "",
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditCustomerID: (id) => set({ editCustomerID: id }),
    setCustomerFormName: (name) => set({ customerFormName: name }),
    setCustomerFormEmail: (email) => set({ customerFormEmail: email }),
}))