
import {useState} from "react";
import {putProduct} from "../../services/productService.tsx";

export interface ProductEditFormProps {
    productId: number;
    productSku: string;
    productName: string;
    productUnit_price: number;
    onCancel: () => void;
    onSuccess: () => void;
}

export const ProductEditForm = ({productId, productSku, productName, productUnit_price, onCancel, onSuccess}: ProductEditFormProps) => {
    const [sku, setSku] = useState<string>(productSku)
    const [name, setName] = useState<string>(productName)
    const [unit_price, setUnit_Price] = useState<number>(productUnit_price)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [unitPriceError, setUnitPriceError] = useState<string>("")

    const handlePut = async () => {
        if(!sku.trim() || !name.trim() || unit_price == 0) {
            return alert("sku, name, unit price required");
        }
        setIsSubmitting(true);
        try {
            await putProduct(productId, { sku, name, unit_price });
            setSku("");
            setName("");
            setUnit_Price(0);
            onSuccess();
        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} required/>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                <input type="number" value={unit_price} onChange={(e) => {
                    const num = e.target.valueAsNumber;
                    if(Number.isNaN(num)) {
                        setUnit_Price(0);
                    }
                    const decimal = num.toString().split('.')[1];
                    if(decimal && decimal.length > 2) {
                        setUnit_Price(Math.floor(num * 100) / 100);
                        setUnitPriceError("Max 2 decimal places");
                        return;
                    }
                    setUnit_Price(num);
                    setUnitPriceError("")
                }} required/>
                <p className="text-red-500">{unitPriceError}</p>
                <div className="flex justify-start">
                    <button type="button" className="mr-2 px-4 bg-blue-100 rounded" onClick={handlePut}>Add</button>
                    {isSubmitting && "Adding"}
                    <button type="button" className="px-4 bg-red-100 rounded" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

