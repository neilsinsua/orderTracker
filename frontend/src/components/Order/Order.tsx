import {useCustomers} from "../../hooks/useCustomers.ts";
import {useOrders} from "../../hooks/useOrders.ts";
import {useState} from "react";
import {OrderForm} from "./OrderForm.tsx";

export interface NewOrderItemType {
    order: number;
    product: number;
    quantity: number;
    unit_price: number;
}

export interface ExistingOrderItemType extends NewOrderItemType {
    id: number;
    product_name: string;
    product_sku: string;
    created_at: string;
    updated_at: string;
}

export interface NewOrderType {
    number: string;
    date_and_time: string;
    customer: number;
    shipping_method: string;
    shipping_cost: number;
    status: string;
    items: ExistingOrderItemType[];
}

export interface ExistingOrderType extends NewOrderType {
    id: number;
    created_at: string;
    updated_at: string;
}

interface ExistingOrderProps {
    order: ExistingOrderType;
}

export const Order = ({order}: ExistingOrderProps) => {
    const {customers} = useCustomers();
    const{deleteOrder} = useOrders();
    const [editOrder, setEditOrder] = useState<number| null>(null);
    const isEditing = editOrder === order.id;

    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            {!isEditing ? (
                <div className="flex space-y-4">
                    <div key={order.id} className="bg-white shadow rounded-lg p-6 w-full">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Order Number</label>
                                <p className="text-lg font-semibold">{order.number}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Date & Time</label>
                                <p className="text-gray-600">{new Date(order.date_and_time).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Customer</label>
                                <p className="text-gray-700">{customers.find(customer => customer.id === order.customer)?.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Shipping Method</label>
                                <p className="text-gray-600">{order.shipping_method}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Shipping Cost</label>
                                <p className="text-gray-600">${order.shipping_cost}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Status</label>
                                <p className="text-gray-600 capitalize">{order.status}</p>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Order Items</label>
                            {order.items.map(item => (
                                <div key={item.id} className="mt-4 pl-4 border-l-2 border-gray-200">
                                    <p className="font-medium">{item.product_name}</p>
                                    <p className="text-gray-600">SKU: {item.product_sku}</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-gray-600">Price: ${item.unit_price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <button
                            onClick={() => {
                                deleteOrder(order.id);
                            }}
                            className="w-24 px-4 py-2 bg-red-300 m-4 text-red-800 font-medium rounded hover:bg-red-400 transition-colors">
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                setEditOrder(order.id);
                            }}
                            className="w-24 px-4 py-2 bg-orange-300 m-4 text-orange-800 font-medium rounded hover:bg-orange-400 transition-colors">
                            Edit
                        </button>
                    </div>
                </div>
            ) : (
                <OrderForm
                    onCancel={() => setEditOrder(null)}
                    onSuccess={() => setEditOrder(null)}
                    order={order}/>
            )}
        </div>
    );
};
