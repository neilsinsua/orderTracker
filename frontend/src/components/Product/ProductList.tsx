import {useProductStore} from "../../stores/productStore.ts";
import {useProducts} from "../../hooks/useProducts.ts";
import {Product} from "./Product.tsx";
import {ProductForm} from "./ProductForm.tsx";


export const ProductList = () => {
    const {showAddForm, setShowAddForm} = useProductStore();
    const {
        products: existingProducts,
    } = useProducts();

    return (
        <div>
            {[...existingProducts].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((c) => (
                <Product key={c.id} product={c}/>
            ))}
            {!showAddForm && (
                <button
                    onClick={() => {
                        setShowAddForm(true);
                    }}
                    className="mr-2 px-4 bg-blue-100 rounded mb-4">
                    Add Product
            </button>
            )}
            {showAddForm && (
                <ProductForm
                    onSuccess={() => setShowAddForm(false)}
                    onCancel={() => setShowAddForm(false)}/>
            )}

        </div>
    );
};
