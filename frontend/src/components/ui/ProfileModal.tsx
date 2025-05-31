import { useState, useRef } from "react";
import { Button } from "./Button";
import { API_URL } from "../../config";
import axios from "axios";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdated: () => void;
    initialProfile?: {
        username: string;
        email: string;
    };
}

export function ProfileModal({ isOpen, onClose, onProfileUpdated, initialProfile }: ProfileModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const usernameRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    async function handleSubmit() {
        const username = usernameRef.current?.value;

        if (!username?.trim()) {
            setError("Username is required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.put(`${API_URL}/api/v1/profile`, { username }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => {
                onProfileUpdated();
                onClose();
            }, 1000);
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to update profile. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Edit Profile
                </h2>
                <div className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 rounded-md text-sm">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            ref={usernameRef}
                            defaultValue={initialProfile?.username || ""}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            aria-label="Username"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={initialProfile?.email || ""}
                            disabled
                            aria-label="Email"
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            text="Cancel"
                            variant="secondary"
                            onClick={onClose}
                        />
                        <Button
                            text="Save Changes"
                            variant="primary"
                            onClick={handleSubmit}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 