import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { API_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    username: string;
    email?: string;
    bio?: string;
}

export function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [newBio, setNewBio] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signin");
                return;
            }

            const response = await axios.get(`${API_URL}/api/v1/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setProfile(response.data);
            setNewBio(response.data.bio || "");
        } catch (err) {
            setError("Failed to load profile");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.put(`${API_URL}/api/v1/profile`, {
                bio: newBio
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            setError("Failed to update profile");
            console.error(err);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-red-600">Profile not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="px-4 py-5 sm:px-6 bg-indigo-600 text-white">
                        <div>
                            <h1 className="text-2xl font-bold">{profile.username}</h1>
                            {profile.email && (
                                <p className="text-indigo-100">{profile.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-4 py-5 sm:p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Bio Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">About</h3>
                                {isEditing ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={newBio}
                                            onChange={(e) => setNewBio(e.target.value)}
                                            rows={4}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <div className="mt-2 flex space-x-2">
                                            <Button
                                                onClick={updateProfile}
                                                variant="primary"
                                                text="Save"
                                            />
                                            <Button
                                                onClick={() => setIsEditing(false)}
                                                variant="secondary"
                                                text="Cancel"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <p className="text-gray-600">
                                            {profile.bio || "No bio yet"}
                                        </p>
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="secondary"
                                            text="Edit Bio"
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Stats Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Activity</h3>
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-indigo-600">0</div>
                                        <div className="text-sm text-gray-500">Posts</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-indigo-600">0</div>
                                        <div className="text-sm text-gray-500">Followers</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-indigo-600">0</div>
                                        <div className="text-sm text-gray-500">Following</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 