import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContentCard } from "./ContentCard";
import { API_URL } from "../../config";
import axios from "axios";

interface SharedContent {
    username: string;
    content: Array<{
        _id: string;
        title: string;
        link: string;
        type: "youtube" | "twitter" | "document";
        createdAt: string;
    }>;
}

const ShareView = () => {
    const { shareLink } = useParams<{ shareLink: string }>();
    const [data, setData] = useState<SharedContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (shareLink) {
            fetchSharedContent(shareLink);
        }
    }, [shareLink]);

    async function fetchSharedContent(link: string) {
        try {
            const response = await axios.get(`${API_URL}/api/v1/brain/${link}`);
            setData(response.data);
            setError("");
        } catch (err: any) {
            console.error("Error fetching shared content:", err);
            if (err.response?.status === 411) {
                setError("This share link is invalid or has expired");
            } else {
                setError("Failed to load shared content. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading shared content...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || "Content not found"}</p>
                    <button
                        onClick={() => navigate("/signin")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {data.username}'s Content
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.content.map(item => (
                        <ContentCard
                            key={item._id}
                            title={item.title}
                            link={item.link}
                            type={item.type}
                            createdAt={item.createdAt}
                            readOnly={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShareView; 