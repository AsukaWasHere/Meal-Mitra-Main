import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from './api';

export default function Donate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        quantity: '',
        location: '',
        price: '', // State for price
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await API.post('/api/listings', {
                ...formData,
                quantity: Number(formData.quantity),
                price: Number(formData.price) // Send price to the API
            });
            alert('✅ Donation posted successfully!');
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message || "Failed to post donation.";
            setError(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-green-900 mb-6 text-center">
                    Post a Donation
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Food Title (e.g., Bread, Rice)" value={formData.title} onChange={handleChange} className="border rounded-lg px-4 py-2" required />
                    <textarea name="description" placeholder="Description (Optional)" value={formData.description} onChange={handleChange} className="border rounded-lg px-4 py-2" />
                    <input type="number" name="quantity" placeholder="Quantity (e.g., servings, items)" value={formData.quantity} onChange={handleChange} className="border rounded-lg px-4 py-2" required />
                    <input type="number" name="price" placeholder="Price per serving (₹)" value={formData.price} onChange={handleChange} className="border rounded-lg px-4 py-2" required />
                    <input type="text" name="location" placeholder="Full Pickup Address" value={formData.location} onChange={handleChange} className="border rounded-lg px-4 py-2" required />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-2">
                        Post Donation
                    </button>
                </form>
            </div>
        </div>
    );
}