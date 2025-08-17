import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFieldArray, useForm} from "react-hook-form";
import {useOrderStore} from "../../stores/orderStore.ts";
import {useProducts} from "../../hooks/useProducts.ts";
import type {ExistingOrderType, NewOrderType} from "./Order.tsx";
import {useOrders} from "../../hooks/useOrders.ts";
import {useDebounce} from "use-debounce";
import {type CustomerOption, getCustomer, searchCustomerNameEmail} from "../../hooks/useCustomerSearch.ts";
import {useEffect, useState} from "react";
import {useOrderItems} from "../../hooks/useOrderItems.ts";
import {useProductSearch, getProduct} from "../../hooks/useProductSearch.ts";
import {Product} from "../Product/Product.tsx";
import {Customer} from "../Customer/Customer.tsx";

export interface OrderFormProps {
    order?: ExistingOrderType;
    onCancel: () => void;
    onSuccess: () => void;
}

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
    customerSearch: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;


export const OrderForm = ({order, onCancel, onSuccess}: OrderFormProps) => {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption>()
    const [customerSearch, setCustomerSearch] = useState<string>("")
    const [productSearch, setProductSearch] = useState<string>("")
    const {createAsyncOrder, updateOrder} = useOrders();
    const {createOrderItem, deleteOrderItem} = useOrderItems();
    const {products} = useProducts();
    const {
        register,
        setValue,
        watch,
        getValues,
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
    watch("customer")
    const {fields, append, remove} = useFieldArray({
        control,
        name: "items"
    })

    const [debouncedCustomerSearch] = useDebounce(customerSearch, 300);
    const [debouncedProductSearch] = useDebounce(productSearch, 300);
    const {data: customerResults = []} = searchCustomerNameEmail(debouncedCustomerSearch);
    const {data: productResults = []} = useProductSearch(debouncedProductSearch);
    const formatDate = (iso: string) => {
        const date = new Date(iso);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        if (order) {
            setValue("number", order.number);
            console.log(order.date_and_time);
            setValue("date_and_time", formatDate(order.date_and_time));
            setValue("customer", order.customer);
            getCustomer(order.customer).then(customer => {
                setSelectedCustomer(customer);
            }).catch(error => {
                console.error("Error fetching customer:", error);
            })
            setValue("shipping_method", order.shipping_method);
            setValue("shipping_cost", order.shipping_cost.toString());
            setValue("status", order.status);
            setValue('items', []);
            order.items.forEach((item) => {
                append({
                    order: item.order,
                    product: item.product,
                    quantity: item.quantity.toString(),
                    unit_price: item.unit_price.toString(),
                })
            })
        }
    }, []);

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
            let orderId;
            if (order?.id) {
                updateOrder({id: order.id, order: orderData});
                orderId = order.id;
            } else {
                const createdOrder = await createAsyncOrder(orderData);
                orderId = createdOrder.id;
            }
            const itemsByProduct = data.items.reduce((acc, item) => {
                if (!acc[item.product]) {
                    acc[item.product] = {
                        order: orderId,
                        product: item.product,
                        quantity: 0,
                        unit_price: parseFloat(item.unit_price)
                    };
                }
                acc[item.product].quantity += parseInt(item.quantity);
                return acc;
            }, {});
            /*if order items exist, delete them first, then create new ones.*/
            if (order?.items) {
                await Promise.all(order.items.map(item => deleteOrderItem(item.id)));
            }
            const itemPromises = Object.values(itemsByProduct).map(async (item) => {
                return createOrderItem({
                    order: item.order,
                    product: item.product,
                    quantity: item.quantity,
                    unit_price: item.unit_price
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
        setSelectedCustomer(undefined);
    }
    return (
        <div className="max-w-md space-y-4 p-4 bg-white shadow-md rounded-lg">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Order Number</label>
                <input type="text"
                       className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('number')}
                       required/>
                {errors.number && <p className="text-red-500 text-xs">{errors.number.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date and Time</label>
                <input
                    type="datetime-local"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('date_and_time')}
                    required
                />
                {errors.date_and_time && <p className="text-red-500 text-xs">{errors.date_and_time.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                {selectedCustomer && (<div className="bg-gray-50 p-2 rounded-md text-sm">
                    <p className="text-gray-700">
                        Name: {selectedCustomer?.name}
                    </p>
                    <p className="text-gray-600">
                        Email: {selectedCustomer?.email}
                    </p>
                </div>)}
                <div className="space-y-2">
                    <input type="text" placeholder="search customers"
                           {...register("customerSearch")}
                           className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           onChange={(e) => setCustomerSearch(e.target.value)}/>
                    {errors.customer && <p className="text-red-500 text-xs">{errors.customer.message}</p>}
                    <input type="text" hidden={true} {...register("customer")}/>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-4 space-y-2 max-h-80 overflow-y-auto">
                    {customerResults.map(customer => {
                            const customerProps = {
                                id: customer.id,
                                name: customer.name,
                                email: customer.email,
                                created_at: customer.createdAt,
                                updated_at: customer.updatedAt,
                            }
                            return (<div key={customer.id} className="p-1 hover:bg-gray-50 cursor-pointer rounded text-sm"
                                         onClick={() => {
                                             const customer = customerResults.find(customer => customer.id === customer.id);
                                             const customerId = parseInt(customer.id);
                                             setValue("customer", customerId);
                                             if (customer) {
                                                 setSelectedCustomer(customer);
                                             }
                                             setValue("customerSearch", "")
                                             setCustomerSearch("");
                                         }}>
                                <Customer key={customer.id} customer={customerProps}/>
                            </div>)
                        }
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shipping Method</label>
                <select
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("shipping_method")}>
                    {SHIPPING_METHODS.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                {errors.shipping_method && <p className="text-red-500 text-xs">{errors.shipping_method.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shipping Cost</label>
                <input type="number" min="0"
                       className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("shipping_cost")} />
                {errors.shipping_cost && <p className="text-red-500 text-xs">{errors.shipping_cost.message}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register("status")} >
                    {ORDER_STATUSES.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Order Items</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-200 rounded-md space-y-2 text-sm">
                        <div className="font-medium text-gray-700">
                            {products.find(product => product.id === parseInt(getValues(`items.${index}.product`)))?.name}
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input type="number" min="1"
                                   className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register(`items.${index}.quantity`)}/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                            <input type="number" min="0" step="0.01"
                                   className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...register(`items.${index}.unit_price`)}/>
                        </div>
                        <div>
                            <button type="button"
                                    className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-500"
                                    onClick={() => remove(index)}>Remove
                            </button>
                        </div>
                    </div>
                ))}
                <label className="block text-sm font-medium text-gray-700">Pick Products</label>
                <input type="text" placeholder="search products"
                       className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       onChange={(e) => setProductSearch(e.target.value)}/>
                {errors.items && <p className="text-red-500 text-xs">{errors.items.message}</p>}
                <div className="bg-white shadow-lg rounded-xl p-4 space-y-2 max-h-80 overflow-y-auto">
                    {productResults.map(product => {
                        const productProps = {
                            id: product.id,
                            sku: product.sku,
                            name: product.name,
                            unit_price: product.unitPrice,
                            stock_level: product.stockLevel,
                            created_at: product.createdAt,
                            updated_at: product.updatedAt,
                        }
                        return (
                            <div key={product.id}
                                 className="flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-150 ease-in-out text-sm"
                                 onClick={() => {
                                     append({
                                         order: 0,
                                         product: parseInt(product.id),
                                         quantity: "1",
                                         unit_price: product.unitPrice.toString(),
                                     })
                                     console.log(product);
                                 }}>
                                <Product key={product.id} product={productProps}/>
                            </div>
                        )
                    })}
                </div>

            </div>
            <div>
                <button type="button"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => {
                            onSubmit();
                            onSuccess();
                        }}>Add Order
                </button>
                <button type="button"
                        className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => {
                            clearForm();
                            onCancel();
                        }}>Cancel
                </button>
            </div>
        </div>
    );
};
