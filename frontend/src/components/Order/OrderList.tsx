import {OrderForm} from "./OrderForm.tsx";
import {useOrders} from "../../hooks/useOrders.ts";
import {useCustomers} from "../../hooks/useCustomers.ts";


export const OrderList = () => {
    const {orders} = useOrders();
    const {customers} = useCustomers();
    return (
        <div className="p-4">
            <div className="space-y-4">
                {orders.map(order =>
                    <div key={order.id} className="bg-white shadow rounded-lg p-6">
                        <p className="text-lg font-semibold">{order.number}</p>
                        <p className="text-gray-600">{order.date_and_time}</p>
                        <p className="text-gray-700">{customers.find(customer => customer.id === order.customer)?.name}</p>
                        <p className="text-gray-600">{order.shipping_method}</p>
                        <p className="text-gray-600">${order.shipping_cost}</p>
                        <p className="text-gray-600 capitalize">{order.status}</p>
                        {order.items.map(item => (
                            <div key={item.id} className="mt-4 pl-4 border-l-2 border-gray-200">
                                <p className="font-medium">{item.product_name}</p>
                                <p className="text-gray-600">SKU: {item.product_sku}</p>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-gray-600">Price: ${item.unit_price}</p>
                            </div>
                        ))}
                    </div>)
                }
            </div>
            <OrderForm/>
        </div>
    );
};

