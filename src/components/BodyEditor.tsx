"use client";
import { useState } from "react";

interface Props {
  body: string;
  onChange: (body: string) => void;
}

export function BodyEditor({ body, onChange }: Props) {
  const [jsonError, setJsonError] = useState("");

  const validateJson = (value: string) => {
    if (value.trim() === "") {
      setJsonError("");
      return;
    }
    try {
      JSON.parse(value);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON format");
    }
  };

  const handleChange = (value: string) => {
    onChange(value);
    validateJson(value);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">Request Body (Raw / JSON)</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">Supports any text, JSON recommended</span>
      </div>
      <textarea
        value={body ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder='Example: {"name": "John", "age": 30}'
        rows={8}
        className={`w-full border rounded-md px-3 py-2 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
          jsonError ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
        } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
      />
      {jsonError && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{jsonError}</p>}
    </div>
  );
}