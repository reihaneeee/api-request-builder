// src/components/UrlInput.tsx
"use client";
import { useState } from "react";

interface Props {
  url: string;
  onChange: (url: string) => void;
}

export function UrlInput({ url, onChange }: Props) {
  const [error, setError] = useState("");

  const validateAndSet = (value: string) => {
    onChange(value);
    if (!value.trim()) {
      setError("URL cannot be empty");
    } else if (!/^https?:\/\//i.test(value)) {
      setError('URL must start with http:// or https://');
    } else {
      setError("");
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={url ?? ''}
        onChange={(e) => validateAndSet(e.target.value)}
        placeholder="Enter URL (e.g., https://api.example.com/users)"
        className={`w-full border rounded-md px-3 py-2 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
          error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
        } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
      />
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}