
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {OrderList} from "./Order/OrderList.tsx";
import {CustomerList} from "./Customer/CustomerList.tsx";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ProductList} from "./Product/ProductList.tsx";

export type Views = "products" | "customers" | "orders";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
        },
    },
});

export const AppController = () => {

    return(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <nav className="flex space-x-4 p-4 bg-gray-100 rounded-lg">
                    <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/customers">Customers</Link>
                    <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/products">Products</Link>
                    <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/orders">Orders</Link>
                </nav>
                <Routes>
                    <Route path="/products" element={<ProductList/>}/>
                    <Route path="/customers" element={<CustomerList/>}/>
                    <Route path="/orders" element={<OrderList/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}