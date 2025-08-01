import type {CustomerFormProps} from "./CustomerForm.tsx";
import {useState} from "react";
import {putCustomer} from "../services/customerService.tsx";

export interface CustomerEditFormProps extends CustomerFormProps {
    customerId: number;
    onSuccess: () => void;
    onCancel: () => void;
    customerName: string;
    customerEmail: string;
}

export const CustomerEditForm = ({onSuccess, onCancel, customerId, customerName, customerEmail}: CustomerEditFormProps) => {
    const [name, setName] = useState<string>(customerName);
    const [email, setEmail] = useState<string>(customerEmail);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handlePut = async () => {
        //validate input
        if (!name.trim() || !email.trim()) {
            return alert("name and email required")
        }
        setIsSubmitting(true);
        try {
            await putCustomer(customerId, { name, email });
            setName("");
            setEmail("");
            onSuccess();
        } catch (err) {
            console.log(err);
            console.log(typeof err);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                <div className="flex flex-col">
                    <input value={name} type="text" onChange={(e) => setName(e.target.value)} required></input>
                    <input value={email} type="text" onChange={(e) => setEmail(e.target.value)} required></input>
                </div>
                <div className="flex justify-start">
                    <button type="button" className="mr-2 px-4 bg-blue-100 rounded" onClick={handlePut}>Add</button>
                    {isSubmitting && "Adding"}
                    <button type="button" onClick={onCancel} className="px-4 bg-red-100 rounded">Cancel</button>
                </div>
            </div>
        </div>
    )
}