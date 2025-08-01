import {useState} from "react";
import {createProduct} from "../../services/productService.tsx";

export interface ProductFormProps {
    onSuccess: () => void;
}

export const ProductForm = ({onSuccess}: ProductFormProps) => {
    const [sku, setSku] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [unit_price, setUnit_Price] = useState<number>(0)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const handleSubmit = async () => {
        if( !sku.trim() || !name.trim() || unit_price == 0) {
            return alert("sku, name, unit price required")
        }
        setIsSubmitting(true)
        try {
            await createProduct({sku, name, unit_price});
            onSuccess()
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        /*TODO format to match Customer Form*/
        <div className="flex items-center w-full mb-4 space-x-4">
            <form className={"flex flex-col"}>
            <input type="text" placeholder="sku" onChange={ e => setSku(e.target.value)} required/>
            <input type="text" placeholder="name" onChange={ e => setName(e.target.value)} required/>
            <input type="number" value={unit_price} onChange={ e => {
                const num = e.target.valueAsNumber
                if(Number.isNaN(num)) {
                    setUnit_Price(0);
                }
                setUnit_Price(num);
            }} required/>
                {/*TODO add invalid number error*/}
            </form>
            <div className="flex justify-start">
                <button type="button" className="mr-2 px-4 bg-blue-100 rounded" onClick={handleSubmit}>Add</button>
            </div>
        </div>
    );
};

