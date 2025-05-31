import { useState } from "react";
import { Button } from "./Button";
import { TrashIcon, DocumentIcon, YoutubeIcon, TwitterIcon } from "../../icons";
import React, { useEffect, useRef } from "react";
import { API_URL } from "../../config"; // Changed BACKEND_URL to API_URL
import axios from "axios";

interface ContentCardProps {
    type: "youtube" | "twitter" | "document";
    link: string;
    title: string;
    onDelete?: () => void;
    createdAt: string;
    readOnly?: boolean;
    contentId: string;
}

// Declare twttr on the window object
declare global {
    interface Window {
        twttr: any;
    }
}

export function ContentCard({ type, link, title, onDelete, createdAt, readOnly = false, contentId }: ContentCardProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const twitterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (type === 'twitter' && link) {
            const loadTwitterScript = () => {
                if (!("twttr" in window)) {
                    const script = document.createElement('script');
                    script.src = "https://platform.twitter.com/widgets.js";
                    script.async = true;
                    document.body.appendChild(script);
                }
            };

            const renderTweet = () => {
                if (twitterRef.current && window.twttr && window.twttr.widgets) {
                    twitterRef.current.innerHTML = '';
                    const tweetId = link.split('/').pop();
                    if (tweetId) {
                        window.twttr.widgets.createTweet(
                            tweetId,
                            twitterRef.current,
                            { 
                                dnt: true,
                                theme: 'light',
                                width: 'auto'
                            }
                        ).catch(() => {
                            if(twitterRef.current) {
                                twitterRef.current.innerHTML = `<p>Could not load tweet. <a href="${link}" target="_blank" rel="noopener noreferrer">View on Twitter</a></p>`;
                            }
                        });
                    }
                }
            };

            loadTwitterScript();

            const checkTwttrInterval = setInterval(() => {
                if (window.twttr && window.twttr.widgets) {
                    clearInterval(checkTwttrInterval);
                    renderTweet();
                }
            }, 100);

            const timeout = setTimeout(() => {
                clearInterval(checkTwttrInterval);
                if (twitterRef.current && !twitterRef.current.innerHTML) {
                    twitterRef.current.innerHTML = `<p>Could not load tweet. <a href="${link}" target="_blank" rel="noopener noreferrer">View on Twitter</a></p>`;
                }
            }, 10000);

            return () => {
                clearInterval(checkTwttrInterval);
                clearTimeout(timeout);
                if(twitterRef.current) {
                    twitterRef.current.innerHTML = '';
                }
            };
        }

        return () => {};
    }, [type, link]);

    function formatDate(dateString: string) {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            return 'Invalid date';
        }
    }

    async function handleDelete() {
        if (!onDelete) return;

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.delete(`${API_URL}/api/v1/content`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                data: { contentId }
            });

            if (response.data.message === "Content deleted successfully") {
                onDelete();
            } else {
                setError("Failed to delete content. Please try again.");
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to delete content. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const renderContent = () => {
        if (!link) {
            return (
                <div className="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 p-4">
                    <p className="text-gray-500 dark:text-gray-400">Content not available</p>
                </div>
            );
        }

        if (type === "youtube") {
            const videoId = link.split('v=')[1]?.split('&')[0];
            if (!videoId) {
                return (
                    <div className="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 p-4">
                        <p className="text-gray-500 dark:text-gray-400">Invalid YouTube link</p>
                    </div>
                );
            }
            return (
                <div className="relative w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                    />
                </div>
            );
        } else if (type === "twitter") {
            return (
                <div className="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700" style={{ height: '300px' }} ref={twitterRef}>
                    <div className="flex items-center justify-center p-6 h-full">
                        <p className="text-gray-500 dark:text-gray-400">Loading tweet...</p>
                    </div>
                </div>
            );
        } else if (type === "document") {
            return (
                <div className="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-center p-4">
                        <a 
                            href={`${API_URL}${link}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            <DocumentIcon className="h-5 w-5" />
                            <span>View Document</span>
                        </a>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderIcon = () => {
        if (type === 'youtube') {
            return <YoutubeIcon className="h-6 w-6 text-red-600 mr-2" />;
        } else if (type === 'twitter') {
            return <TwitterIcon className="h-6 w-6 text-blue-400 mr-2" />;
        } else if (type === 'document') {
            return <DocumentIcon className="h-6 w-6 text-gray-600 mr-2" />;
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden w-full border border-gray-100 dark:border-gray-700">
            <div className="p-5">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {title}
                    </h3>
                </div>
                <div className="mt-2">
                    {renderContent()}
                </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Added {formatDate(createdAt)}
                </p>
                {!readOnly && onDelete && (
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete content"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
} 