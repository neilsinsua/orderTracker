import {Customer} from "./Customer.tsx";
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
                <div className="flex justify-start px-4 py-4 bg-white shadow rounded-lg">
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                        }}
                        className="px-4 py-2 bg-blue-300 text-white-800 font-medium rounded hover:bg-blue-400 transition-colors"
                    >
                        Add Customer
                    </button>
                </div>)}
            {showAddForm && (
                <CustomerForm
                onCancel={() => setShowAddForm(false)}
            onSuccess={() => setShowAddForm(false)}
        />
    )
}
</div>
)
    ;
};
