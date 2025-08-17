import {OrderForm} from "./OrderForm.tsx";
import {useOrders} from "../../hooks/useOrders.ts";
import {Order} from "./Order.tsx";
import {useState} from "react";



export const OrderList = () => {
    const {orders} = useOrders();
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    return (
        <div className="p-4">
            <div className="space-y-4">
                {orders.map(order =>
                    <Order key={order.id} order={order}/>)
                }
            </div>
            {showAddForm ? (<OrderForm
                onSuccess={() => {
                    setShowAddForm(false);
                }}
                onCancel={() => {
                setShowAddForm(false);
            }}/>) : (<button
                onClick={() => {
                    setShowAddForm(true);
                }}
                className="px-4 py-2 bg-blue-300 text-white-800 font-medium rounded hover:bg-blue-400 transition-colors">Add</button>)}

        </div>
    );
};

