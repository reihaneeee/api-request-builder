"use client"
import { useState } from "react";

interface Props {
    url: string;
    onChange: (url:string) => void;
}

export function UrlInput({ url, onChange }: Props) {
    const [error, setError] = useState("");

    const validateAndSet = (value:string) => {
        onChange(value);
        if (!value.trim()) {
            setError("URL cannot be empty");
        } else if (!/https?:\/\//i.test(value)) {
            setError('URL must sart with http:// of https://');
        } else {
            setError("");
        }
    };

    return (
        <div className="flex-1">
            <input
                type="text"
                value={url}
                onChange={(e) => validateAndSet(e.target.value)}
                placeholder="Enter URL (e.g., https://api.example.com/users"
                className={`w-full border rounded-md px-3 py-2 font-mono text-sm ${error} ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500`}
                />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}