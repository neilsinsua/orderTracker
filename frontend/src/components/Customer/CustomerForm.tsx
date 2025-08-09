import type {ExistingCustomerType} from "./Customer.tsx";
import {useCustomers} from "../../hooks/useCustomers.ts";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCustomerStore} from "../../stores/customerStore.ts";
import {useEffect} from "react";

export interface CustomerFormProps {
    customer?: ExistingCustomerType; // If present, it means we are editing an existing customer
    onCancel: () => void;
    onSuccess: () => void;
}

const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email().min(1, "Email is required"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export const CustomerForm = ({customer, onSuccess, onCancel}: CustomerFormProps) => {
    const {createCustomer, updateCustomer, isCreating, isUpdating} = useCustomers(); // server state
    const {
        customerFormName,
        customerFormEmail,
        setCustomerFormName,
        setCustomerFormEmail,
    } = useCustomerStore(); // local state

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<CustomerFormData>({ // form validation
        resolver: zodResolver(customerSchema),
        defaultValues: customer
            ? {name: customer.name, email: customer.email}
            : {name: "", email: ""}
    });

    useEffect(() => {
        if (customer) {
            setCustomerFormName(customer.name);
            setCustomerFormEmail(customer.email);
        }
    }, [customer, setCustomerFormName, setCustomerFormEmail]);

    const onSubmit = handleSubmit(async (data: CustomerFormData) => {
        try {
            if (customer) {
                await updateCustomer({ id: customer.id, customer: data });
            } else {
                await createCustomer(data);
            }
            setCustomerFormName("");
            setCustomerFormEmail("");
            onSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    })

    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                <div className="flex flex-col">
                    <input {...register("name")} value={customerFormName} type="text" onChange={(e) => setCustomerFormName(e.target.value)} required></input>
                    {errors.name && (
                        <p className="text-red-500 mb-1">{errors.name.message}</p>
                    )}
                    <input {...register("email")} value={customerFormEmail} type="text" onChange={(e) => setCustomerFormEmail(e.target.value)} required></input>
                    {errors.email && (
                        <p className="text-red-500 mb-1">{errors.email.message}</p>
                    )}
                </div>
                <div className="flex justify-start">
                    <button type="button" className="mr-2 px-4 bg-blue-100 rounded" onClick={onSubmit}>Add</button>
                    {isSubmitting && "Adding"}
                    <button type="button" onClick={() => {
                        setCustomerFormName("");
                        setCustomerFormEmail("");
                        onCancel();
                    }} className="px-4 bg-red-100 rounded">Cancel</button>
                    {isCreating && "Creating"}
                    {isUpdating && "Updating"}
                </div>
            </div>
        </div>
    )
}