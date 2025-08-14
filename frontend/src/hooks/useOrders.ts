import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createOrder, fetchOrders, putOrder, removeOrder} from "../services/OrderService.ts";
import type {NewOrderType} from "../components/Order/Order.tsx";

export const useOrders = () => {
    const queryClient = useQueryClient();

    const {data: orders = [], isLoading, isError} = useQuery({
        queryKey: ['orders'],
        queryFn: () => fetchOrders(),
    });

    const createMutation = useMutation({
        mutationFn: (order: NewOrderType) => createOrder(order),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders']});
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, order}: {id: number, order: NewOrderType}) => putOrder(id, order),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders']});
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => removeOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders']});
        },
    });

    return {
        orders,
        isLoading,
        isError,
        createOrder: createMutation.mutate,
        createAsyncOrder: createMutation.mutateAsync,
        updateOrder: updateMutation.mutate,
        deleteOrder: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}