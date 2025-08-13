import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createOrderItem, deleteOrderItem, fetchOrderItems, putOrderItem} from "../services/OrderItemService.ts";
import type {NewOrderItemType} from "../components/Order/Order.tsx";

export const useOrderItems = () => {
    const queryClient = useQueryClient();

    const {data: orderItems = [], isLoading, isError} = useQuery({
        queryKey: ['order-items'],
        queryFn: () => fetchOrderItems(),
    });

    const createMutation = useMutation({
        mutationFn: (item: NewOrderItemType) => createOrderItem(item),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['order-items']});
        },
    });

     const updateMutation = useMutation({
         mutationFn: ({id, item}: {id: number, item: NewOrderItemType}) => putOrderItem(id, item),
         onSuccess: () => {
             queryClient.invalidateQueries({queryKey: ['order-items']});
         },
     });

     const deleteMutation = useMutation({
         mutationFn: (id: number) => deleteOrderItem(id),
         onSuccess: () => {
             queryClient.invalidateQueries({queryKey: ['order-items']});
         },
     })

    return {
         orderItems,
        isLoading,
        isError,
        createOrderItem: createMutation.mutate,
        updateOrderItem: updateMutation.mutate,
        deleteOrderItem: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}
