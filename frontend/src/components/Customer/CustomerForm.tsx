import type {ExistingCustomerType} from "./Customer.tsx";
import {useCustomers} from "../../hooks/useCustomers.ts";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
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
        register,
        setValue,
        reset,
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
            setValue("name", customer.name);
            setValue("email", customer.email);
        }
    }, [customer]);

    const onSubmit = handleSubmit(async (data: CustomerFormData) => {
        try {
            if (customer) {
                await updateCustomer({ id: customer.id, customer: data });
            } else {
                await createCustomer(data);
            }
            reset({name: "", email: ""});
            onSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    })

    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-6 bg-white shadow-lg rounded-lg">
                <div className="flex flex-col space-y-4">
                    <input
                        {...register("name")}
                        type="text"
                        placeholder="Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></input>
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></input>
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>
                <div className="flex justify-start space-x-4 mt-6">
                    <button
                        type="button"
                        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                        onClick={onSubmit}
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            reset({name: "", email: ""});
                            onCancel();
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    {isCreating && <span className="text-blue-500">Creating...</span>}
                    {isUpdating && <span className="text-orange-500">Updating...</span>}
                </div>
            </div>
        </div>
    )
}