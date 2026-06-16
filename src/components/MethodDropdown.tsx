"use client";
import { useState, useRef, useEffect } from "react";

interface Props {
  method: string;
  onChange: (method: string) => void;
}

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const methodColors: Record<string, string> = {
  GET: "text-green-600 dark:text-green-400",
  POST: "text-blue-600 dark:text-blue-400",
  PUT: "text-orange-600 dark:text-orange-400",
  PATCH: "text-purple-600 dark:text-purple-400",
  DELETE: "text-red-600 dark:text-red-400",
};

export function MethodDropdown({ method, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-bold text-sm ${methodColors[method]}`}
      >
        {method}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""} text-gray-500 dark:text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
          {methods.map((m) => (
            <li
              key={m}
              onClick={() => {
                onChange(m);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-sm font-bold cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2 ${
                m === method ? "bg-blue-100 dark:bg-blue-900/50" : ""
              } ${methodColors[m]}`}
            >
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}