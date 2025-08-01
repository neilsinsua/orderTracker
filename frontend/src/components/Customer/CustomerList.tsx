import type {ExistingCustomerType} from "./Customer.tsx";
import { Customer } from "./Customer.tsx";

interface CustomerListProps {
    existingCustomers: ExistingCustomerType[];
    loading: boolean;
    error: string | null;
    onAddCustomer: () => void;
    showAddCustomerButton: boolean;
    onDeleteCustomer: () => void;
    onPutCustomer:() => void;
}

export const CustomerList = ({
    existingCustomers,
    loading,
    error,
    onAddCustomer,
    showAddCustomerButton,
    onDeleteCustomer,
    onPutCustomer
}: CustomerListProps) => {
    if (loading) return <p>Loading Customers…</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            {[...existingCustomers].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((c) => (
                <Customer key={c.id} customer={c} onDeleteCustomer={onDeleteCustomer} onPutCustomer={onPutCustomer}/>
            ))}

            {!showAddCustomerButton && (
                <button
                    onClick={onAddCustomer}
                    className="mr-2 px-4 bg-blue-100 rounded"
                >
                    Add Customer
                </button>
            )}
        </div>
    );
};
