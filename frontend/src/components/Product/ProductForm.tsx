import {use, useState} from "react";
import {createProduct} from "../../services/productService.tsx";
import {type AxiosError, isAxiosError} from "axios";

export interface ProductFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

type SkuError = {sku: string[]}

export const ProductForm = ({onSuccess, onCancel}: ProductFormProps) => {
    const [sku, setSku] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [unit_price, setUnit_Price] = useState<number>(0)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [skuError, setSkuError] = useState<string>("")
    const [unitPriceError, setUnitPriceError] = useState<string>("")
    const checkSkuError = (err: unknown): err is AxiosError<SkuError> => {
        return isAxiosError(err);
    }
    const handleSkuError = (err: AxiosError<SkuError>) => {
        const error = err.response.data.sku[0];
        setSkuError(error);
    }
    const handleSubmit = async () => {
        if( !sku.trim() || !name.trim() || unit_price == 0) {
            return alert("sku, name, unit price required")
        }
        setIsSubmitting(true)
        try {
            await createProduct({sku, name, unit_price});
            onSuccess()
        } catch (err) {
            if(checkSkuError(err)) {
                handleSkuError(err);
            }
            console.log(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                <form className={"flex flex-col"}>
            <input type="text" className="mb-2" placeholder="sku" onChange={ e => setSku(e.target.value)} required/>
                <p className="text-red-500">{skuError}</p>
            <input type="text" className="mb-2" placeholder="name" onChange={ e => setName(e.target.value)} required/>
            <input type="number" className="mb-2" value={unit_price} onChange={ e => {
                const num = e.target.valueAsNumber
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
                setUnitPriceError("");
            }} required/>
                    <p className="text-red-500">{unitPriceError}</p>
            </form>
            <div className="flex justify-start">
                <button type="button" className="mr-2 px-4 bg-blue-100 rounded" onClick={handleSubmit}>Add</button>
                {isSubmitting && "Adding"}
                <button type="button" className="mr-2 px-4 bg-red-100 rounded" onClick={onCancel}>Cancel</button>
            </div>
            </div>
        </div>
    );
};

