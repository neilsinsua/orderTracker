import { useState } from "react";
import {createCustomer} from "../../services/customerService.tsx";

export interface CustomerFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export const CustomerForm = ({ onCancel, onSuccess}: CustomerFormProps) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async () => {
        //validate input
        if (!name.trim() || !email.trim()) {
            return alert("name and email required")
        }
        setIsSubmitting(true);
        try {
            await createCustomer({ name, email });
            setName("");
            setEmail("");
            onSuccess();
        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center w-full mb-4 space-x-4">
            <div className="flex-1 max-w-md p-4 bg-white shadow rounded-lg">
                <div className="flex flex-col">
                    <input type="text" placeholder="name" className="mb-2" onChange={(e) => setName(e.target.value)} required></input>
                    {/*TODO invalid email error*/}
                    <input className={"mb-2"} placeholder="email" type="text" onChange={(e) => setEmail(e.target.value)} required></input>
                </div>
                <div className="flex justify-start">
                    <button type="button" className="mr-2 px-4 bg-blue-100 rounded" onClick={handleSubmit}>Add</button>
                    {isSubmitting && "Adding"}
                    <button type="button" onClick={onCancel} className="px-4 bg-red-100 rounded">Cancel</button>
                </div>
            </div>
        </div>
    )
}