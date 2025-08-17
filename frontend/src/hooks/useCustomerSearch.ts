import {gql} from "graphql-request";
import {useQuery} from "@tanstack/react-query";
import {graphqlClient} from "../services/graphqlClient.ts";
import {Customer, type ExistingCustomerType} from "../components/Customer/Customer.tsx";

export type CustomerOption = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

const SEARCH_CUSTOMERS = gql`
    query SearchCustomers($q: String!, $limit: Int) {
        customers(q: $q, limit: $limit) {
            id
            name
            email
            createdAt
            updatedAt
        }
    }
`;

const GET_CUSTOMER = gql`
                query GetCustomer($id: Int!) {
                    customer(id: $id) {
                        id
                        name
                        email
                        createdAt
                        updatedAt
                    }
                }
            `

export function searchCustomerNameEmail(q: string | undefined, limit = 5) {
    return useQuery<CustomerOption[], Error>({
        queryKey: ['customers', q],
        queryFn: async () => {
            if (!q) return [];
            const data = await graphqlClient.request(SEARCH_CUSTOMERS, {q, limit});
            return data.customers ?? [];
        },
    });
}

export async function getCustomer(id: number): Promise<CustomerOption> {
    try {
        const response = await graphqlClient.request(GET_CUSTOMER, {id});
        return response.customer;
    } catch (error) {
        console.error("Error fetching customer:", error);
        throw error;
    }
}
