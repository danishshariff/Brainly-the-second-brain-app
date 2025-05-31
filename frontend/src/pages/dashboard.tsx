import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { ContentCard } from "../components/ui/ContentCard";
import { Logo } from "../components/ui/Logo";
import { API_URL } from "../config";
import { ProfileIcon, LogoutIcon, YoutubeIcon, TwitterIcon, AddIcon, ShareIcon, LogoIcon, DocumentIcon, SunIcon, MoonIcon } from "../icons";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { ProfileModal } from "../components/ui/ProfileModal";

interface Content {
    _id: string;
    title: string;
    link: string;
    type: "youtube" | "twitter" | "document";
    createdAt: string;
}

interface UserProfile {
    username: string;
    email: string;
    bio: string;
}

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [content, setContent] = useState<Content[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<"youtube" | "twitter" | "document" | "all">("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
            return;
        }

        fetchContent();
        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                handleSearch();
            } else {
                fetchContent();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    async function handleSearch() {
        if (!searchTerm.trim()) {
            fetchContent();
            return;
        }

        try {
            setIsSearching(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get(`${API_URL}/api/v1/content/search`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                params: {
                    q: searchTerm
                }
            });

            setContent(response.data.results);
        } catch (err) {
            setError("Failed to search content");
        } finally {
            setIsSearching(false);
        }
    }

    async function checkShareStatus() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get(`${API_URL}/api/v1/brain/share`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.data.hash) {
                setShareLink(response.data.hash);
            } else {
                setShareLink(null);
            }
        } catch (err) {
            setError("Failed to check share status");
        }
    }

    async function toggleShare() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            setIsSharing(true);
            const response = await axios.post(
                `${API_URL}/api/v1/brain/share`,
                { share: !shareLink },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.data.hash) {
                setShareLink(response.data.hash);
                setError("");
            } else {
                setShareLink(null);
                setError("");
            }
        } catch (err) {
            setError("Failed to update share status");
            setShareLink(null);
        } finally {
            setIsSharing(false);
        }
    }

    async function fetchContent() {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signin");
                return;
            }

            const response = await axios.get(`${API_URL}/api/v1/content`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data && response.data.content) {
                setContent(response.data.content);
            } else {
                setContent([]);
            }
        } catch (err: any) {
            console.error("Failed to fetch content:", err);
            if (err.code === 'ERR_NETWORK') {
                setError("Cannot connect to the server. Please make sure the backend server is running.");
            } else if (err.response?.status === 404) {
                setError("Backend server not found. Please make sure the server is running.");
            } else if (err.response?.status === 401) {
                navigate("/signin");
            } else {
                setError("Failed to fetch content. Please try again later.");
            }
            setContent([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(contentId: string) {
        try {
            setContent(prevContent => prevContent.filter(item => item._id !== contentId));
        } catch (err) {
            setError("Failed to delete content");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

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

            if (response.data) {
                setUserProfile(response.data);
            }
        } catch (error: any) {
            console.error("Failed to fetch profile:", error);
            if (error.code === 'ERR_NETWORK') {
                setError("Cannot connect to the server. Please make sure the backend server is running.");
            } else if (error.response?.status === 401) {
                navigate("/signin");
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Button
                        text="Try Again"
                        variant="primary"
                        onClick={fetchContent}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed top-0 left-0 h-full">
                <Link to="/dashboard" className="mb-8 flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                    <LogoIcon />
                    <span className="text-xl font-bold">Brainly</span>
                </Link>
                <div className="flex flex-col space-y-4">
                    <Button
                        text="Twitter"
                        variant={selectedType === "twitter" ? "primary" : "secondary"}
                        onClick={() => setSelectedType("twitter")}
                        icon={<TwitterIcon />}
                    />
                    <Button
                        text="Youtube"
                        variant={selectedType === "youtube" ? "primary" : "secondary"}
                        onClick={() => setSelectedType("youtube")}
                        icon={<YoutubeIcon />}
                    />
                    <Button
                        text="Document"
                        variant={selectedType === "document" ? "primary" : "secondary"}
                        onClick={() => setSelectedType("document")}
                        icon={<DocumentIcon />}
                    />
                    <Button
                        text="All Content"
                        variant={selectedType === "all" ? "primary" : "secondary"}
                        onClick={() => setSelectedType("all")}
                    />
                </div>
                <div className="mt-auto flex flex-col space-y-4">
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
                    >
                        <ProfileIcon />
                        <span>{userProfile?.username || "User"}</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
                    >
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
                    >
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 p-8 ml-64 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Button
                            text={shareLink ? "Stop Sharing" : "Share Content"}
                            variant="primary"
                            onClick={toggleShare}
                            icon={<ShareIcon />}
                            loading={isSharing}
                        />
                        <Button
                            text="Add Content"
                            variant="primary"
                            onClick={() => setIsModalOpen(true)}
                            icon={<AddIcon />}
                        />
                    </div>
                </div>

                {shareLink && (
                    <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-medium">Share Link:</p>
                            <p className="text-sm mt-1">{`${window.location.origin}/share/${shareLink}`}</p>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/share/${shareLink}`);
                                setSuccessMessage("Link copied to clipboard!");
                                setTimeout(() => setSuccessMessage(""), 2000);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {isSearching ? (
                    <div className="text-center py-8 text-gray-700 dark:text-gray-300">Searching...</div>
                ) : content.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {searchTerm ? "No content found matching your search" : "No content yet. Add some!"}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content
                            .filter(item => selectedType === "all" || item.type === selectedType)
                            .map(item => (
                                <div key={item._id} className="w-full">
                                    <ContentCard
                                        title={item.title}
                                        link={item.link}
                                        type={item.type}
                                        onDelete={() => handleDelete(item._id)}
                                        createdAt={item.createdAt}
                                        contentId={item._id}
                                    />
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CreateContentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onContentAdded={() => {
                        setIsModalOpen(false);
                        fetchContent();
                    }}
                    defaultType="youtube"
                />
            )}

            {showProfileModal && (
                <ProfileModal
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    onProfileUpdated={fetchProfile}
                    initialProfile={userProfile || undefined}
                />
            )}
        </div>
    );
}

