
import {ProductForm} from "./ProductForm.tsx";
import {useProductStore} from "../../stores/productStore.ts";
import {useProducts} from "../../hooks/useProducts.ts";

export interface NewProductType {
    sku: string;
    name: string;
    unit_price: number;
    stock_level: number;
}

export interface ExistingProductType extends NewProductType {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface ExistingProductProps {
    product: ExistingProductType;
}


export const Product = ({ product }: ExistingProductProps) => {

    const {deleteProduct} = useProducts();
    const {editProductID, setEditProductID} = useProductStore();
    const isEditing = editProductID === product.id;

    const handleDelete = async () => {
        await deleteProduct(product.id);
    }

    return (
        <div>
            {!isEditing ? (<div className="flex items-center w-full mb-4 space-x-4">
                <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg space-y-2">
                    <p className="text-gray-600">SKU: {product.sku}</p>
                    <p className="text-lg font-semibold">{product.name}</p>
                    <p className="text-gray-700">Price: ${product.unit_price}</p>
                    <p className="text-gray-600">Stock: {product.stock_level}</p>
                </div>
                <button onClick={() => setEditProductID(product.id)} type="button"
                        className="px-4 py-2 bg-orange-300 text-orange-800 font-medium rounded hover:bg-orange-400 transition-colors">Edit
                </button>
                <button type="button" onClick={handleDelete}
                        className="px-4 py-2 bg-red-300 text-red-800 font-medium rounded hover:bg-red-400 transition-colors">Delete
                </button>
            </div>) : (<ProductForm product={product}
                                    onCancel={() => setEditProductID(null)}
                                    onSuccess={() => setEditProductID(null)}/>)}
        </div>
    );
}