import {useEffect, useState} from "react";
import {fetchProducts} from "../../services/productService.tsx";
import {ProductList} from "./ProductList.tsx";
import {ProductForm} from "./ProductForm.tsx";
import type {ExistingProductType} from "./Product.tsx";


export const ProductManager = () => {
    const [products, setProducts] = useState<ExistingProductType[]>([])
    const [showForm, setShowForm] = useState<boolean>(false)


    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.log(error);
        }
    }
    const handleSuccess = () => {
        setShowForm(false);
        loadProducts();
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return(
        <div>
            <ProductList existingProducts={products}
                         onAddProduct={() => setShowForm(true)}
                         onDeleteProduct={() => loadProducts()}
                         onCancel={() => setShowForm(false)}
                         onPutProduct={() => loadProducts()}/>
            {showForm && <ProductForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)}/>}
        </div>
    )
}