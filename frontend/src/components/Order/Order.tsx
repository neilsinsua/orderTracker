
export interface NewOrderItemType {
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
}

export interface ExistingOrderItemType extends NewOrderItemType {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface NewOrderType {
    number: string;
    date_and_time: string;
    customer_id: number;
    shipping_method: string;
    shipping_cost: number;
    status: string;
    items: NewOrderItemType[];
}

export interface ExistingOrderType extends NewOrderType {
    id: number;
    created_at: string;
    updated_at: string;
}

interface ExistingOrderProps {
    order: ExistingOrderType;
}

const Order = ({order}: ExistingOrderProps) => {
    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                <p>{order.number}</p>
                <p>{order.date_and_time}</p>
                <p>{order.shipping_method}</p>
                <p>{order.shipping_cost}</p>
                <p>{order.status}</p>
            </div>
        </div>
    );
};
