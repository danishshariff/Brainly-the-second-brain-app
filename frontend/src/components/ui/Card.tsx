import { useEffect } from "react";
import { ShareIcon } from "../../icons/ShareIcon"

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube";
}

export function Card({title, link, type}: CardProps) {
    useEffect(() => {
        // Load Twitter widget script
        if (type === "twitter") {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [type]);

    const getYouTubeEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const videoId = urlObj.searchParams.get("v");
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
            // Handle youtu.be links
            if (urlObj.hostname === "youtu.be") {
                return `https://www.youtube.com/embed${urlObj.pathname}`;
            }
            return url;
        } catch {
            return url;
        }
    };

    const getTwitterEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            // Convert x.com to twitter.com
            if (urlObj.hostname === "x.com") {
                urlObj.hostname = "twitter.com";
            }
            return urlObj.toString();
        } catch {
            return url;
        }
    };

    if (type === "youtube") {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-[280px]">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <ShareIcon />
                        </a>
                    </div>
                </div>
                <iframe
                    className="w-full h-[200px]"
                    src={getYouTubeEmbedUrl(link)}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
                    <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ShareIcon />
                    </a>
                </div>
            </div>
            <div className="w-full bg-gray-50">
                <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
                    <a href={getTwitterEmbedUrl(link)}></a>
                </blockquote>
            </div>
        </div>
    );
}