import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

interface Content {
    type: "twitter" | "youtube" | "document";
    link: string;
    title: string;
}

export function useContent() {
    const [contents, setContents] = useState<Content[]>([]);
    const [error, setError] = useState<string>("");

    async function refresh() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please sign in again");
                return;
            }

            const response = await axios.get(`${API_URL}/api/v1/content`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.data || !response.data.content) {
                setError("Invalid response from server");
                return;
            }

            // Validate and transform the content
            const validContents = response.data.content
                .filter((content: any) => {
                    const isValid = content.type === "twitter" || content.type === "youtube" || content.type === "document";
                    if (!isValid) {
                        console.warn(`Invalid content type: ${content.type}`);
                    }
                    return isValid;
                })
                .map((content: any) => ({
                    type: content.type as "twitter" | "youtube" | "document",
                    link: content.link,
                    title: content.title || "Untitled"
                }));

            setContents(validContents);
            setError("");
        } catch (err: any) {
            console.error("Error fetching content:", err);
            if (err.response?.status === 403) {
                setError("Please sign in again");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to fetch content. Please try again.");
            }
        }
    }

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 10 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { contents, refresh, error };
}