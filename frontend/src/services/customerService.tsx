import axios from "axios";
import { Customer } from "../components/Customer";
import { apiurl } from "./apiconfig";

const api = axios.create({
    baseURL: apiurl,
    timeout: 5000,
});

export async function fetchCustomers(): Promise<Customer[]> {
    try {
        const response = await api.get<Customer[]>("/customers/");
        return response.data;
    } catch (error) {
        console.error("Customer fetch error:", error);
        throw error;
    }}

export async function createCustomer(customer: Customer): Promise<Customer> {
    try {
        const response = await api.post<Customer>("customers/", customer);
        return response.data;
    } catch (error) {
        console.error("Create customer error:", error);
        throw error;
    }
}