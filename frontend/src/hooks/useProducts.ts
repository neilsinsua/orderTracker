import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createProduct, removeProduct, fetchProducts, putProduct} from "../services/productService.tsx";
import type {NewProductType} from "../components/Product/Product.tsx";


export const useProducts = () => {
    const queryClient = useQueryClient();

    const {data: products = [], isLoading, error} = useQuery({
        queryKey: ['products'],
        queryFn: () => fetchProducts(),
    });

    const createMutation = useMutation({
        mutationFn: (product: NewProductType) => createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, product}: {id: number, product: NewProductType}) => putProduct(id, product),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => removeProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        },
    });

    return {
        products,
        isLoading,
        error,
        createProduct: createMutation.mutate,
        updateProduct: updateMutation.mutate,
        deleteProduct: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}