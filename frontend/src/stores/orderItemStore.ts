import {create} from "zustand";

interface OrderItemUIState {
    showAddForm: boolean;
    editOrderItemID: number | null;
    orderItemFormProduct_id: number;
    orderItemFormQuantity: number;
    orderItemFormUnit_price: number;
    setShowAddForm: (show: boolean) => void;
    setEditOrderItemID: (id: number | null) => void;
    setOrderItemFormProduct_id: (id: number) => void;
    setOrderItemFormQuantity: (quantity: number) => void;
    setOrderItemFormUnit_price: (unit_price: number) => void;
}

export const useOrderItemStore = create<OrderItemUIState>((set) => ({
    showAddForm: false,
    editOrderItemID: null,
    orderItemFormProduct_id: 0,
    orderItemFormQuantity: 0,
    orderItemFormUnit_price: 0,
    setShowAddForm: (show) => set({ showAddForm: show }),
    setEditOrderItemID: (id) => set({ editOrderItemID: id }),
    setOrderItemFormProduct_id: (id) => set({ orderItemFormProduct_id: id }),
    setOrderItemFormQuantity: (quantity) => set({ orderItemFormQuantity: quantity }),
    setOrderItemFormUnit_price: (unit_price) => set({ orderItemFormUnit_price: unit_price }),
    })
)