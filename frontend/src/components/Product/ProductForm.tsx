import type {ExistingProductType, NewProductType} from "./Product.tsx";
import {useProducts} from "../../hooks/useProducts.ts";
import {useProductStore} from "../../stores/productStore.ts";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";



export interface ProductFormProps {
    product?: ExistingProductType;
    onCancel: () => void;
    onSuccess: () => void;
}

const productSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Name is required"),
    unit_price: z.string()
                .regex(/^(0|[1-9]\d*)\.\d{2}$/, {message: "Enter a number (2 decimal places)"})
                .refine(value => parseFloat(value) >= 0, {message: "No negative prices"}),
    stock_level: z.string()
                .regex(/^[0-9]+$/, {message: "Enter a whole number"})
                .refine(value => parseFloat(value) >= 0, {message: "No negative stock"})
})
type ProductFormData = z.infer<typeof productSchema>;

export const ProductForm = ({product, onCancel, onSuccess}: ProductFormProps) => {
    const {
        updateProduct,
        createProduct,
    } = useProducts();
    const {
        productFormSku,
        productFormName,
        productFormUnit_price,
        productFormStock_level,
        setProductFormSku,
        setProductFormName,
        setProductFormUnit_price,
        setProductFormStock_level
    } = useProductStore();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: product
        ? {sku: product.sku, name: product.name, unit_price: product.unit_price.toString(), stock_level: product.stock_level.toString()}
            : {sku: "", name: "", unit_price: "", stock_level: ""}
    });

    useEffect(() => {
        if (product) {
            setProductFormSku(product.sku);
            setProductFormName(product.name);
            setProductFormUnit_price(product.unit_price);
            setProductFormStock_level(product.stock_level);
        }
    }, [product, setProductFormSku, setProductFormName, setProductFormUnit_price, setProductFormStock_level]);

    const onSubmit = handleSubmit(async (data: ProductFormData) => {
        try {
            const formattedData: NewProductType = {
                sku: data.sku,
                name: data.name,
                unit_price: parseFloat(data.unit_price),
                stock_level: parseInt(data.stock_level)
            };
            if(product) {
                await updateProduct({id: product.id, product: formattedData});
            } else {
                await createProduct(formattedData);
            }
            setProductFormSku("");
            setProductFormName("");
            setProductFormUnit_price(0);
            setProductFormStock_level(0);
            onSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    })

    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                <input {...register("sku")} type="text" value={productFormSku} onChange={(e) => setProductFormSku(e.target.value)} required/>
                {errors.sku && (<p className="text-red-500">{errors.sku.message}</p>)}
                <input {...register("name")} type="text" value={productFormName} onChange={(e) => setProductFormName(e.target.value)} required/>
                {errors.name && (<p className="text-red-500">{errors.name.message}</p>)}
                <input {...register("unit_price")} type="number" value={productFormUnit_price} onChange={(e) => setProductFormUnit_price(e.target.valueAsNumber)} required/>
                {errors.unit_price && (<p className="text-red-500">{errors.unit_price.message}</p>)}
                <input {...register("stock_level")} type="number" className="mb-2" value={productFormStock_level} onChange={ e => setProductFormStock_level(e.target.valueAsNumber)} required/>
                {errors.stock_level && (<p className="text-red-500">{errors.stock_level.message}</p>)}
                <div className="flex justify-start">
                    <button type="button" className="mr-2 px-4 bg-blue-100 rounded" onClick={onSubmit}>Add</button>
                    {isSubmitting && "Adding"}
                    <button type="button" className="px-4 bg-red-100 rounded" onClick={() => {
                        setProductFormSku("");
                        setProductFormName("");
                        setProductFormUnit_price(0);
                        setProductFormStock_level(0);
                        onCancel();
                    }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

