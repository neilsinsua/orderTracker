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
                <div className="flex justify-start px-4 py-4 bg-white shadow rounded-lg">
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                        }}
                        className="px-4 py-2 bg-blue-300 text-white-800 font-medium rounded hover:bg-blue-400 transition-colors">
                        Add Product
                    </button>
                </div>

            )}
            {showAddForm && (
                <ProductForm
                    onSuccess={() => setShowAddForm(false)}
                    onCancel={() => setShowAddForm(false)}/>
            )}

        </div>
    );
};
