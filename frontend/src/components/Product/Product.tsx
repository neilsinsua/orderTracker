
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
                <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                    <p>{product.sku}</p>
                    <p>{product.name}</p>
                    <p>{product.unit_price}</p>
                    <p>{product.stock_level}</p>
                </div>
                <button onClick={() => setEditProductID(product.id)} type="button" className="px-2 bg-orange-300 rounded">edit</button>
                <button type="button" onClick={handleDelete} className="px-2 bg-red-300 rounded">delete</button>
            </div>) : (<ProductForm product={product}
                                    onCancel={() => setEditProductID(null)}
                                    onSuccess={() => setEditProductID(null)}/>)}
        </div>

    );
}