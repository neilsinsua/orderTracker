import React, { useState } from "react";

export const CustomerForm: React.FC = () => {
    return (
        <div className="p-4 bg-white shadow rounded-lg mb-4">
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input type="text" className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" className="w-full p-2 border rounded" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </div>
    )
}