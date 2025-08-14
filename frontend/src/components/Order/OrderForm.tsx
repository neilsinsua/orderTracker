import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFieldArray, useForm} from "react-hook-form";
import {useCustomers} from "../../hooks/useCustomers.ts";
import {useOrderStore} from "../../stores/orderStore.ts";
import {useProducts} from "../../hooks/useProducts.ts";
import type {NewOrderType} from "./Order.tsx";
import {createOrderItem} from "../../services/OrderItemService.ts";
import {useOrders} from "../../hooks/useOrders.ts";

const SHIPPING_METHODS: string[] = [
    'standard',
    'express',
    'tnt',
    'startrak',
]

const ORDER_STATUSES: string[] = [
    'pending',
    'completed',
    'canceled'
]

//input validation
const orderItemSchema = z.object({
    order: z.number("Order ID required"),
    product: z.number().min(1, "Please select a product"),
    quantity: z.string().refine(value => parseInt(value) > 0, {message: "Quantity must be greater than 0"}),
    unit_price: z.string().refine(value => parseFloat(value) >= 0, {message: "Price cannot be negative"}),
});

const orderSchema = z.object({
    number: z.string().min(1, "Order number is required"),
    date_and_time: z.string().min(1, "Date and time is required"),
    customer: z.number().min(1, "Please select a customer"),
    shipping_method: z.enum(SHIPPING_METHODS as [string, ...string[]]),
    shipping_cost: z.string().refine(value => parseFloat(value) >= 0, {message: "Shipping cost cannot be negative"}),
    status: z.enum(ORDER_STATUSES as [string, ...string[]]),
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

type OrderFormData = z.infer<typeof orderSchema>;

export const OrderForm = () => {
    const {customers} = useCustomers();
    const {products} = useProducts();
    const customerOptions = customers.map(customer => ({
        value: customer.id.toString(),
        label: `${customer.name} (${customer.email})`,
    }))
    const productOptions = products.map(product => ({
        value: product.id.toString(),
        label: `${product.name} (${product.sku})`,
        unit_price: product.unit_price.toString(),
        stock_level: product.stock_level.toString(),
    }))
    const {
        register,
        setValue,
        getValues,
        watch,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            number: "",
            date_and_time: new Date().toISOString().slice(0, 16),
            customer: 0,
            shipping_method: "standard",
            shipping_cost: "",
            status: "pending",
            items: []
        }
    });
    const {fields, append, remove } = useFieldArray({
        control,
        name:"items"
    })
    watch("customer")
    const {
        customerSearch,
        setCustomerSearch,
        productSearch,
        setProductSearch,
    } = useOrderStore();
    const {createAsyncOrder} = useOrders();
    const onSubmit = handleSubmit(async (data: OrderFormData) => {
        try {
            const orderData: NewOrderType = {
            number: data.number,
            date_and_time: new Date(data.date_and_time).toISOString(),
            customer: data.customer,
            shipping_method: data.shipping_method,
            shipping_cost: parseFloat(data.shipping_cost),
            status: data.status,
            items: []
        };
            const createdOrder = await createAsyncOrder(orderData);
            const itemPromises = data.items.map(async (item) => {
                return createOrderItem({
                    order: createdOrder.id,
                    product: item.product,
                    quantity: parseInt(item.quantity),
                    unit_price: parseFloat(item.unit_price),
                });
            });
            await Promise.all(itemPromises);
            clearForm();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    })
    const clearForm = () => {
        setValue("number", "");
        setValue("date_and_time", "");
        setValue("customer", 0);
        setValue("shipping_method", "");
        setValue("shipping_cost", "");
        setValue("status", "");
        setValue("items", []);
        setCustomerSearch("");
        setProductSearch("");
    }
    return (
        <div className="space-y-6 p-6 bg-white shadow-md rounded-lg">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Order Number</label>
                <input type="text"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('number')}
                       required/>
                {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date and Time</label>
                <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('date_and_time')}
                    required
                />
                {errors.date_and_time && <p className="text-red-500 text-sm">{errors.date_and_time.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <div className="text-green-700">
                    {customerOptions.find(option => option.value === getValues("customer").toString())?.label}
                </div>
                <div className="space-y-2">
                    <input type="text" placeholder="search customers"
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           onChange={(e) => setCustomerSearch(e.target.value)}/>
                    {errors.customer && <p className="text-red-500 text-sm">{errors.customer.message}</p>}
                    <input type="text" hidden={true} {...register("customer")}/>
                </div>
                <div className="mt-2 space-y-1">
                    {customerOptions.filter(option => option.label.toLowerCase().includes(customerSearch.toLowerCase())).map(option => (
                        <div key={option.value} className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                             onClick={() => {
                                 const value = parseInt(option.value);
                                 setValue("customer", value);
                             }}>{option.label}</div>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shipping Method</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("shipping_method")}>
                    {SHIPPING_METHODS.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                {errors.shipping_method && <p className="text-red-500 text-sm">{errors.shipping_method.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shipping Cost</label>
                <input type="number" min="0"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("shipping_cost")} />
                {errors.shipping_cost && <p className="text-red-500 text-sm">{errors.shipping_cost.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("status")} >
                    {ORDER_STATUSES.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Order Items</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 rounded-md space-y-3">
                        <div className="font-medium text-gray-700">
                            {productOptions.find(option => option.value === getValues(`items.${index}.product`).toString())?.label}
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input type="number" min="1"
                                   className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register(`items.${index}.quantity`)}/>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                            <input type="number" min="0" step="0.01"
                                   className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register(`items.${index}.unit_price`)}/>
                        </div>
                        <div>
                            <button type="button"
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500"
                                    onClick={() => remove(index)}>Remove
                            </button>
                        </div>
                    </div>
                ))}
                <label className="block text-sm font-medium text-gray-700">Pick Products</label>
                <input type="text" placeholder="search products"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       onChange={(e) => setProductSearch(e.target.value)}/>
                {errors.items && <p className="text-red-500 text-sm">{errors.items.message}</p>}
                <div className="space-y-2">
                    {productOptions.filter(option => option.label.toLowerCase().includes(productSearch.toLowerCase())).map(option => (
                        <div key={option.value}
                             className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer rounded"
                             onClick={() => {
                                 const product = products.find(product => product.id === parseInt(option.value));
                                 if (product) {
                                     append({
                                         order: 0,
                                         product: product.id,
                                         quantity: "1",
                                         unit_price: product.unit_price.toString(),
                                     })
                                 }
                             }}>
                            <p className="flex-1">{option.label}</p>
                            <p className="text-gray-600">${option.unit_price}</p>
                            <p className="text-gray-600">Stock: {option.stock_level}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <button type="button"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => {
                            onSubmit();
                            console.log(errors.items);
                        }}>Add Order
                </button>
                <button type="button"
                        className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => clearForm()}>Cancel
                </button>
            </div>
        </div>
    );
};
