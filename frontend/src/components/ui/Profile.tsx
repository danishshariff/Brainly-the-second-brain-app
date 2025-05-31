import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { API_URL } from "../../config";
import axios from "axios";

interface UserProfile {
    username: string;
    email: string;
}

export function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
            return;
        }

        fetchProfile();
    }, [navigate]);

    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get(`${API_URL}/api/v1/user/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setProfile(response.data);
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="text-center text-red-600">{error || "Profile not found"}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1 text-lg text-gray-900">{profile.username}</div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 text-lg text-gray-900">{profile.email}</div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            text="Back to Dashboard"
                            variant="primary"
                            onClick={() => navigate("/dashboard")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 