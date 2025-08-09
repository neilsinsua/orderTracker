
import { Customer } from "./Customer.tsx";
import {useCustomerStore} from "../../stores/customerStore.ts";
import {useCustomers} from "../../hooks/useCustomers.ts";
import {CustomerForm} from "./CustomerForm.tsx";


export const CustomerList = () => {
    const {showAddForm, setShowAddForm} = useCustomerStore();
    const {
        customers: ExistingCustomers,
        isLoading,
        error,
    } = useCustomers();

    if (isLoading) return <p>Loading Customers…</p>;
    if (error) return <p className="text-red-500">{error.message}</p>;

    return (
        <div>
            {[...ExistingCustomers].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((c) => (
                <Customer key={c.id} customer={c}/>
            ))}
            {!showAddForm && (
                <button
                    onClick={() => {
                        setShowAddForm(true);
                    }}
                    className="mr-2 mb-4 px-4 bg-blue-100 rounded"
                >
                    Add Customer
                </button>
            )}
            {showAddForm && (
                <CustomerForm
                    onCancel={() => setShowAddForm(false)}
                    onSuccess={() => setShowAddForm(false)}
                />
            )}
        </div>
    );
};
