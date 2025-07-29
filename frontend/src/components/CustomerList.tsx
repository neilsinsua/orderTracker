import { useEffect, useState } from "react"
import { Customer as CustomerType, Customer as CustomerCard } from "./Customer"
import { fetchCustomers } from "../services/customerService"
import { CustomerForm } from "./CustomerForm"

export const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<CustomerType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);

    // fetch customers on mount
    useEffect(() => {
        fetchCustomers()
            .then(data => {
                setCustomers(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError("Fetch Customers Failed");
                setLoading(false);
            })
    }, []);

    if (loading) return <p>Loading Customers...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            {customers.map((customer, index) => (
                <CustomerCard key={index} customer={customer} />
            ))}
            {showForm && (
                <>
                    <CustomerForm />
                    <button
                        className="mt-4 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        onClick={() => setShowForm(false)}
                    >
                        Cancel
                    </button>
                </>
            )}
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setShowForm(true)}>
                Add Customer
            </button>

        </div>
    )

}