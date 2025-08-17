import {gql} from "graphql-request";
import {useQuery} from "@tanstack/react-query";
import {graphqlClient} from "../services/graphqlClient.ts";

export type ProductOption = {
    id: number;
    sku: string;
    name: string;
    unitPrice: number;
    stockLevel: number;
    createdAt: string;
    updatedAt: string;
}

const SEARCH_PRODUCTS = gql`
query searchProducts($q: String!, $limit: Int) {
    products(q: $q, limit: $limit) {
        id
        sku
        name
        unitPrice
        stockLevel
        createdAt
        updatedAt
    }
}`;

const GET_PRODUCT = gql`
                query GetProduct($id: Int!) {
                    product(id: $id) {
                        id
                        name
                        unitPrice
                        stockLevel
                        createdAt
                        updatedAt
                    }
                }
            `

export function useProductSearch(q: string | undefined, limit = 5) {
    return useQuery<ProductOption[], Error>({
        queryKey: ['products', q],
        queryFn: async () => {
            if (!q) return [];
            const data = await graphqlClient.request(SEARCH_PRODUCTS, {q, limit});
            return data.products ?? [];
        },
    });
}

export async function getProduct(id: number): Promise<ProductOption> {
    try {
        const response = await graphqlClient.request(GET_PRODUCT, {id});
        return response.product;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}