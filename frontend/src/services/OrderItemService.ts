import axios from "axios";
import {apiurl} from "./apiconfig.tsx";
import type {ExistingOrderItemType, NewOrderItemType} from "../components/Order/Order.tsx";

const api = axios.create({
    baseURL: apiurl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    }
})

export async function fetchOrderItems(orderID: number): Promise<ExistingOrderItemType> {
    try {
        const response = await api.get(`/order-items/?order_id=${orderID}`);
        return response.data;
    } catch (error) {
        console.error("OrderItem fetch error:", error);
        throw error;
    }
}

export async function createOrderItem(item: NewOrderItemType) {
    try {
        const response = await api.post("/order-items/", item);
        return response.data;
    } catch (error) {
        console.error("OrderItem create error:", error);
        throw error;
    }
}

export async function deleteOrderItem(id: number) {
    try {
        await api.delete(`/order-items/${id}/`);
    } catch (error) {
        console.error("OrderItem delete error:", error);
        throw error;
    }
}

export async function putOrderItem(id: number, item: NewOrderItemType) {
    try {
        await api.put(`/order-items/${id}/`, item);
    } catch (error) {
        console.error("OrderItem update error:", error);
    }
}