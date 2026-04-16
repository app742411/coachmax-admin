import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createTerm } from "../../api/adminApi";
import { toast } from "react-hot-toast";

const TermForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        year: new Date().getFullYear(),
        startDate: "",
        endDate: "",
    });

    // Validates DD/MM/YYYY
    const isValidDate = (date: string) => {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
    };

    // Helper to force conversion if the input is YYYY-MM-DD
    const formatToDDMMYYYY = (dateStr: string) => {
        if (dateStr.includes("-")) {
            const [year, month, day] = dateStr.split("-");
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "year" ? parseInt(value) || 0 : value,
        }));
    };

    const createMutation = useMutation({
        mutationFn: createTerm,
        onSuccess: () => {
            toast.success("Term created successfully");
            setFormData({
                name: "",
                year: new Date().getFullYear(),
                startDate: "",
                endDate: "",
            });
        },
        onError: () => toast.error("Failed to create term"),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert the strings just in case they are in YYYY-MM-DD
        const formattedStart = formatToDDMMYYYY(formData.startDate);
        const formattedEnd = formatToDDMMYYYY(formData.endDate);

        // Validation check
        if (!isValidDate(formattedStart) || !isValidDate(formattedEnd)) {
            toast.error("Please enter date in DD/MM/YYYY format");
            return;
        }

        const payload = {
            name: formData.name,
            year: formData.year,
            startDate: formattedStart, // 👈 Guaranteed DD/MM/YYYY
            endDate: formattedEnd,     // 👈 Guaranteed DD/MM/YYYY
        };

        console.log("FINAL PAYLOAD 👉", payload);
        createMutation.mutate(payload);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Add Term</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Term Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Summer Term"
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Year</label>
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Start Date</label>
                    <input
                        type="text"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">End Date</label>
                    <input
                        type="text"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-blue-300"
                >
                    {createMutation.isPending ? "Saving..." : "Create Term"}
                </button>
            </form>
        </div>
    );
};

export default TermForm;