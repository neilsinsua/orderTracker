
import {type ExistingProductType, Product} from "./Product.tsx";

interface ProductListProps {
    existingProducts: ExistingProductType[];
    onAddProduct: () => void;
    onDeleteProduct: () => void;
    onCancel: () => void;
    onPutProduct: () => void;
}

export const ProductList = ({existingProducts, onAddProduct, onCancel, onDeleteProduct, onPutProduct}: ProductListProps) => {
    return (
        <div>
            {[...existingProducts].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((c) => (
                <Product key={c.id} product={c} onDelete={onDeleteProduct} onPutProduct={onPutProduct}/>
            ))}
            <button
                    onClick={onAddProduct}
                    className="mr-2 px-4 bg-blue-100 rounded mb-4"
                >
                    Add Product
            </button>
        </div>
    );
};
