import axios from "axios";
import {apiurl} from "./apiconfig.tsx";
import type {ExistingProductType, NewProductType} from "../components/Product/Product.tsx";

const api = axios.create({
    baseURL: apiurl,
    timeout: 5000,
})

export async function fetchProducts(): Promise<ExistingProductType[]> {
    try {
        const response = await api.get("/products/");
        return response.data;
    } catch (error) {
        console.error("Product Fetch Error:", error);
        throw error;
    }
}

export async function createProduct(product: NewProductType ): Promise<NewProductType> {
    try {
        const response = await api.post("/products/", product);
        return response.data;
    } catch (error) {
        console.error("Product Create Error:", error);
        throw error
    }
}

export async function deleteProduct(id: number): Promise<void> {
    try {
        await api.delete(`/products/${id}/`);
    } catch (error) {
        console.log(error);
    }
}

export async function putProduct(id: number, product: NewProductType) {
    try {
        await api.put(`/products/${id}/`, product);
    } catch (error) {
        console.log(error);
    }
}