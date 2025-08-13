import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createCustomer, deleteCustomer, fetchCustomers, putCustomer} from "../services/customerService.ts";
import type {NewCustomerType} from "../components/Customer/Customer.tsx";

export const useCustomers = () => {
    const queryClient = useQueryClient();

    const { data: customers = [], isLoading, error } = useQuery({
        queryKey: ['customers'],
        queryFn: fetchCustomers,
    });

    const createMutation = useMutation({
        mutationFn: (newCustomer: NewCustomerType) => createCustomer(newCustomer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers']});
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, customer}: {id: number, customer: NewCustomerType}) => putCustomer(id, customer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers']});
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCustomer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers']});
        },
    });

    return {
        customers,
        isLoading,
        error,
        createCustomer: createMutation.mutate,
        updateCustomer: updateMutation.mutate,
        deleteCustomer: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };

}