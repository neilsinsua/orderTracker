
import {deleteProduct, putProduct} from "../../services/productService.tsx";
import {useState} from "react";
import {ProductEditForm} from "./ProductEditForm.tsx";

export interface ExistingProductType extends NewProductType {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface NewProductType {
    sku: string;
    name: string;
    unit_price: number;
}

export interface ExistingProductProps {
    product: ExistingProductType;
    onDelete: () => void
    onPutProduct: () => void;
}


export const Product = ({product, onDelete, onPutProduct}: ExistingProductProps) => {
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const handleDelete = async () => {
        try {
            await deleteProduct(product.id!);
            onDelete();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {!showEditForm ? (<div className="flex items-center w-full mb-4 space-x-4">
                <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                    <p>{product.sku}</p>
                    <p>{product.name}</p>
                    <p>{product.unit_price}</p>
                </div>
                <button type="button" onClick={handleDelete} className="mr-1 px-2 bg-red-300 rounded">delete</button>
                <button onClick={() => setShowEditForm(true)} type="button" className="px-2 bg-orange-300 rounded">edit</button>
            </div>) : (<ProductEditForm productId={product.id}
                                        productSku={product.sku}
                                        productName={product.name}
                                        productUnit_price={product.unit_price}
                                        onCancel={() => setShowEditForm(false)}
                                        onSuccess={() => {
                                            setShowEditForm(false);
                                            onPutProduct();
                                        }}/>)}
        </div>

    );
}