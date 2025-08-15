
import {CustomerForm} from "./CustomerForm.tsx";
import {useCustomers} from "../../hooks/useCustomers.ts";
import {useCustomerStore} from "../../stores/customerStore.ts";

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
}

export const Customer = ({ customer }: ExistingCustomerProps) => {

    const { deleteCustomer, isDeleting } = useCustomers();
    const { editCustomerID, setEditCustomerID } = useCustomerStore();
    const isEditing = editCustomerID === customer.id;

    const handleDelete = async () => {
        await deleteCustomer(customer.id);
    };

    return (
        <div>
            {!isEditing ? (
                <div className="flex items-center w-full mb-4 space-x-4">
                    <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                        <p className="text-lg font-semibold">{customer.name}</p>
                        <p className="text-gray-600">{customer.email}</p>
                    </div>
                    <button
                        onClick={() => setEditCustomerID(customer.id)}
                        className="px-4 py-2 bg-orange-300 text-orange-800 font-medium rounded hover:bg-orange-400 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-300 text-red-800 font-medium rounded hover:bg-red-400 transition-colors"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            ) : (
                <CustomerForm customer={customer}
                              onCancel={() => setEditCustomerID(null)}
                              onSuccess={() => setEditCustomerID(null)}/>
            )}
        </div>
    );
}

