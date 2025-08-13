import {apiurl} from "./apiconfig.tsx";
import type {ExistingOrderType, NewOrderType} from "../components/Order/Order.tsx";
import axios from "axios";


const api = axios.create({
    baseURL: apiurl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    }
})

export async function fetchOrders(): Promise<ExistingOrderType[]> {
    try {
        const response = await api.get<ExistingOrderType[]>("/orders/");
        return response.data;
    } catch (error) {
        console.error("Order fetch error:", error);
        throw error;
    }
}

export async function createOrder(order: NewOrderType): Promise<ExistingOrderType> {
    try {
        const response = await api.post<ExistingOrderType>("/orders/", order);
        return response.data;
    } catch (error) {
        console.error("Order create error:", error);
        throw error;
    }
}

export async function removeOrder(id: number): Promise<void> {
    try {
        await api.delete(`/orders/${id}/`);
    } catch (error) {
        console.error("Order delete error:", error);
        throw error;
    }
}

export async function putOrder(id: number, order: NewOrderType) {
    try {
        await api.put(`/orders/${id}/`, order);
    } catch (error) {
        console.error("Order update error:", error);
        throw error;
    }
}