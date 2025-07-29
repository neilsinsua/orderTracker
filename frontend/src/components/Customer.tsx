import React from "react";

export interface Customer {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface CustomerProps {
    customer: Customer;
}

export const Customer: React.FC<CustomerProps> = ({ customer }) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg mb-4">
            <p className="text-gray-700">{customer.name}</p>
            <h4></h4><p className="text-blue-500">{customer.email}</p>
        </div>
    );
}

