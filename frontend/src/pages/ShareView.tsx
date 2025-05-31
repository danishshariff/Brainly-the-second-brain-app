import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ContentCard } from "../components/ui/ContentCard";
import { Alert } from "../components/ui/Alert";
import { API_URL } from "../config";
import axios from "axios";
import { ProfileIcon } from "../icons";

interface Content {
    id: string;
    type: "youtube" | "twitter" | "document";
    url: string;
    title: string;
    createdAt: string;
}

interface UserProfile {
    username: string;
    email: string;
    bio: string;
}

export default function ShareView() {
    const { shareLink } = useParams();
    const [content, setContent] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        async function fetchSharedContent() {
            try {
                const response = await axios.get(`${API_URL}/api/v1/brain/${shareLink}`);
                setContent(response.data.content);
                setUserProfile(response.data.userProfile);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    setError("This shared content is no longer available.");
                } else {
                    setError("Failed to load shared content. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchSharedContent();
    }, [shareLink]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <Alert
                    type="error"
                    message={error}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* User Profile Section */}
                {userProfile && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <ProfileIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {userProfile.username}
                                </h2>
                                {userProfile.bio && (
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        {userProfile.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((item) => (
                        <ContentCard
                            key={item.id}
                            type={item.type}
                            url={item.url}
                            title={item.title}
                            createdAt={item.createdAt}
                            readOnly
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 