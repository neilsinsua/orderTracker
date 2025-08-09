import axios from "axios";
import type {ExistingCustomerType, NewCustomerType} from "../components/Customer/Customer.tsx";
import { apiurl } from "./apiconfig";

const api = axios.create({
    baseURL: apiurl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    }
});


export async function fetchCustomers(): Promise<ExistingCustomerType[]> {
    try {
        const response = await api.get<ExistingCustomerType[]>("/customers/");
        return response.data;
    } catch (error) {
        console.error("Customer fetch error:", error);
        throw error;
    }
}

export async function createCustomer(customer: NewCustomerType): Promise<NewCustomerType> {
    try {
        const response = await api.post<NewCustomerType>("/customers/", customer);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteCustomer(id: number): Promise<void> {
    try {
        await api.delete(`/customers/${id}/`);
    } catch (error) {
        console.error("Customer delete error:", error);
        throw error;
    }
}

export async function putCustomer(id: number, customer: NewCustomerType) {
    try {
        await api.put(`/customers/${id}/`, customer);
    } catch (error) {
        console.log(error);
    }
}