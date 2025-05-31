import { useState } from "react";
import { Button } from "./Button";
import { API_URL } from "../../config";
import axios from "axios";

interface CreateContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContentAdded: () => void;
    defaultType: "youtube" | "twitter" | "document";
}

export function CreateContentModal({ isOpen, onClose, onContentAdded, defaultType }: CreateContentModalProps) {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<"youtube" | "twitter" | "document">(defaultType);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!title) {
            setError("Title is required");
            return;
        }

        if (type !== 'document' && !link) {
            setError("Link is required for YouTube and Twitter content");
            return;
        }

        if (type === 'document' && !file) {
            setError("File is required for document content");
            return;
        }

        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("User not authenticated. Please sign in.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        if (type === 'document' && file) {
            formData.append('file', file);
        } else if (link) {
            formData.append('link', link);
        }

        try {
            await axios.post(`${API_URL}/api/v1/content`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            onContentAdded();
            onClose();
            setTitle("");
            setLink("");
            setFile(null);
            setType(defaultType);
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors?.length > 0) {
                setError(err.response.data.errors.map((e: any) => e.message).join(", "));
            } else {
                setError("Failed to add content");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Add New Content</h2>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title-input">Title</label>
                    <input
                        id="title-input"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        placeholder="Enter content title"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type-select">Type</label>
                    <select
                        id="type-select"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={type}
                        onChange={(e) => setType(e.target.value as "youtube" | "twitter" | "document")}
                        disabled={loading}
                        title="Select content type"
                    >
                        <option value="youtube">YouTube</option>
                        <option value="twitter">Twitter</option>
                        <option value="document">Document (PDF/Doc)</option>
                    </select>
                </div>

                {type !== 'document' ? (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link-input">Link</label>
                        <input
                            id="link-input"
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            disabled={loading}
                            placeholder="Enter YouTube or Twitter link"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file-upload">Upload Document</label>
                        <input
                            id="file-upload"
                            type="file"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            disabled={loading}
                            accept=".pdf,.doc,.docx"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Button
                        text="Add Content"
                        variant="primary"
                        onClick={handleSubmit}
                        loading={loading}
                    />
                    <Button
                        text="Cancel"
                        variant="secondary"
                        onClick={() => {
                            onClose();
                            setTitle("");
                            setLink("");
                            setFile(null);
                            setError("");
                            setType(defaultType);
                        }}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}