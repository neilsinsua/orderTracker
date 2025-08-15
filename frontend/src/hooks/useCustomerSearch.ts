import {gql} from "graphql-request";
import {useQuery} from "@tanstack/react-query";
import {graphqlClient} from "../services/graphqlClient.ts";

export type CustomerOption = {
    id: number;
    name: string;
    email: string;
}

const SEARCH_CUSTOMERS = gql`
    query SearchCustomers($q: String!, $limit: Int) {
        customers(q: $q, limit: $limit) {
            id
            name
            email
        }
    }
`;

export function useCustomerSearch(q: string | undefined, limit = 5) {
    return useQuery<CustomerOption[], Error>({
        queryKey: ['customers', q],
        queryFn: async () => {
            if (!q) return [];
            const data = await graphqlClient.request(SEARCH_CUSTOMERS, {q, limit});
            return data.customers ?? [];
        },
    });
}
