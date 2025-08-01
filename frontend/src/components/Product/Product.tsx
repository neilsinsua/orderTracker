
import {deleteProduct} from "../../services/productService.tsx";

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
}


export const Product = ({product, onDelete}: ExistingProductProps) => {
    const handleDelete = async () => {
        try {
            await deleteProduct(product.id!);
            onDelete();

        } catch (error) {
            console.log(error);
        }
    }

    return (
            <div className={"flex items-center w-full mb-4 space-x-4"}>
                <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                    <p>{product.sku}</p>
                    <p>{product.name}</p>
                    <p>{product.unit_price}</p>
                </div>
                <button type="button" onClick={handleDelete}>delete</button>
                {/*TODO add edit button and functionality*/}
            </div>
    );
}