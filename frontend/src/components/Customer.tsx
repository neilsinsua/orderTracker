import {deleteCustomer} from "../services/customerService";
import {useState} from "react";
import {CustomerEditForm} from "./CustomerEditForm.tsx";

export interface NewCustomerType {
    name: string;
    email: string;

}

export interface ExistingCustomerType extends NewCustomerType {
    id: number;
    created_at: string;
    updated_at: string;
}

interface ExistingCustomerProps {
    customer: ExistingCustomerType;
    onDeleteCustomer: () => void;
    onPutCustomer: () => void
}

export const Customer = ({ customer, onDeleteCustomer, onPutCustomer }: ExistingCustomerProps) => {

    const [showForm, setShowForm] = useState<boolean>(false)
    const handleDelete = async () => {
        try {
            await deleteCustomer(customer.id!);
            onDeleteCustomer()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {!showForm ? (
                <div className={"flex items-center w-full mb-4 space-x-4"}>
                    <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                    <p>{customer.name}</p>
                    <p>{customer.email}</p>
                </div>
                <button type="button" onClick={handleDelete} className={"mr-1"}>delete</button>
                <button onClick={() => setShowForm(true)}>edit</button>
                </div>
            ) : (
                <CustomerEditForm
                    customerId={customer.id}
                    customerEmail={customer.email}
                    customerName={customer.name}
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        onPutCustomer();
                    }}
                />
            )}

        </div>
    );
}

