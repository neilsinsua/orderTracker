import {CustomerManager} from "./Customer/CustomerManager.tsx";
import {ProductManager} from "./Product/ProductManager.tsx";
import {NavBar} from "./NavBar.tsx";
import {useState} from "react";

export type Views = "products" | "customers"

export const AppController = () => {
const [view, setView] = useState<Views>("products")

    return(
        <div>
            <NavBar onCustomerClick={() => {
                setView("customers");
            }} onProductsClick={() => {
                setView("products");
            }}/>
            {view === 'customers' && (<CustomerManager/>)}
            {view === 'products' && (<ProductManager/>)}
            {/*TODO add OrderManager*/}
        </div>
    )
}