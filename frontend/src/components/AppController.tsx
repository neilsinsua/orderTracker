
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
                <nav className="flex">
                    <Link className="mr-2" to="/customers">Customers</Link>
                    <Link to="/products">Products</Link>
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