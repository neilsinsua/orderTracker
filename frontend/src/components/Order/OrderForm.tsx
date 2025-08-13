import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFieldArray, useForm} from "react-hook-form";
import {useCustomers} from "../../hooks/useCustomers.ts";
import {useOrderStore} from "../../stores/orderStore.ts";
import {useProducts} from "../../hooks/useProducts.ts";
import {createOrder} from "../../services/OrderService.ts";
import type {NewOrderType} from "./Order.tsx";
import {createOrderItem} from "../../services/OrderItemService.ts";

const SHIPPING_METHODS: string[] = [
    'Standard',
    'Express',
    'TNT',
    'Startrak',
]

const ORDER_STATUSES: string[] = [
    'Pending',
    'Completed',
    'Canceled'
]

//input validation
const orderItemSchema = z.object({
    order_id: z.number().min(1, "Please select an order"),
    product_id: z.number().min(1, "Please select a product"),
    quantity: z.string().refine(value => parseInt(value) > 0, {message: "Quantity must be greater than 0"}),
    unit_price: z.string().refine(value => parseFloat(value) >= 0, {message: "Price cannot be negative"}),
});

const orderSchema = z.object({
    number: z.string().min(1, "Order number is required"),
    date_and_time: z.iso.datetime({message: "Invalid date and time format"}),
    customer_id: z.number().min(1, "Please select a customer"),
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
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            number: "",
            date_and_time: new Date().toISOString().slice(0, 16),
            customer_id: 0,
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
    const {
        customerSearch,
        setCustomerSearch,
        productSearch,
        setProductSearch,
    } = useOrderStore();
    const onSubmit = handleSubmit(async (data: OrderFormData) => {
        try {
            const orderData: NewOrderType = {
            number: data.number,
            date_and_time: data.date_and_time,
            customer_id: data.customer_id,
            shipping_method: data.shipping_method,
            shipping_cost: parseFloat(data.shipping_cost),
            status: data.status,
            items: []
        };
            const createdOrder = await createOrder(orderData);
            const itemPromises = data.items.map(async (item) => {
                return createOrderItem({
                    order_id: createdOrder.id,
                    product_id: item.product_id,
                    quantity: parseInt(item.quantity),
                    unit_price: parseFloat(item.unit_price),
                });
            });
            await Promise.all(itemPromises);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    })
    return (
        <div>
            <div>
                <label>Order Number</label>
                <input type="text" {...register('number')} required/>
                {errors.number && <p className="text-red-500">{errors.number.message}</p>}
            </div>
            <div>
                <label>Date and Time</label>
                <input
                    type="datetime-local"
                    {...register('date_and_time')}
                    required
                />
                {errors.date_and_time && <p className="text-red-500">{errors.date_and_time.message}</p>}
            </div>
            <div className="">
                <label>Customer</label>
                <div>
                    <input type="text" placeholder="search customers" onChange={(e) => setCustomerSearch(e.target.value)}/>
                    {errors.customer_id && <p className="text-red-500" >{errors.customer_id.message}</p>}
                    <input type="text" hidden={true} {...register("customer_id")}/>
                </div>
                <div>
                    {customerOptions.filter(option => option.label.toLowerCase().includes(customerSearch.toLowerCase())).map(option => (
                        <div key={option.value} onClick={() => {
                            const value = parseInt(option.value);
                            setValue("customer_id", value);
                        }}>{option.label}</div>
                    ))}
                </div>
            </div>
            <div>
                <label>shipping method</label>
                <select {...register("shipping_method")}>
                    {SHIPPING_METHODS.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Shipping Cost</label>
                <input type="number" min="0" {...register("shipping_cost")} />
            </div>
            <div>
                <label>Status</label>
                <select {...register("status")} >
                    {ORDER_STATUSES.map(value => (
                    <option key={value} value={value}>{value}</option>
                ))}
                </select>
            </div>
            <div>
                <label>Order Items</label>
                {fields.map((field, index) => (
                    <div key={field.id}>
                        <div>
                             {productOptions.find(option => option.value === getValues(`items.${index}.product_id`).toString())?.label}
                        </div>
                        <div className="flex">
                            <label>Quantity</label>
                            <input type="number" min="1" {...register(`items.${index}.quantity`)}/>
                        </div>
                        <div>
                            <label>Unit Price</label>
                            <input type="number" min="0" step="0.01" {...register(`items.${index}.unit_price`)}/>
                        </div>
                        <div>
                            <button type="button" onClick={() => remove(index)}>Remove</button>
                        </div>
                    </div>
                ))}
                <label>Pick Products</label>
                {productOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2" onClick={() => {
                        const product = products.find(product => product.id === parseInt(option.value));
                        if (product) {
                            append({
                                order_id: 0,
                                product_id: product.id,
                                quantity: "1",
                                unit_price: product.unit_price.toString(),
                            })
                        }
                    }} >
                        <p>{option.label}</p>
                        <p>{option.unit_price}</p>
                        <p>{option.stock_level}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
