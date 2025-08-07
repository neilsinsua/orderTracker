import { useState } from "react";
import {createCustomer} from "../../services/customerService.tsx";
import axios, {type AxiosError} from "axios";

export interface CustomerFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

type EmailErr =  {email: string[]};

export const CustomerForm = ({ onCancel, onSuccess}: CustomerFormProps) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [emailErr, setEmailErr] = useState<string>("");
    const checkEmailErr = (err: unknown): err is AxiosError<EmailErr> => {
        return axios.isAxiosError(err);
    }
    const handleEmailErr = (err: AxiosError<EmailErr>): string => {
        const error = err.response.data.email[0];
        setEmailErr(error);
    }

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
            setEmailErr("")
            onSuccess();
        } catch (err) {
            if(checkEmailErr(err)) {
                handleEmailErr(err);
            }
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
                    <input className="mb-2" placeholder="email" type="text" onChange={(e) => setEmail(e.target.value)} required></input>
                    <p className="text-red-500 mb-1">{emailErr}</p>
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