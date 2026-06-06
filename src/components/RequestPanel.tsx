"use client"

import { useState, useMemo } from "react";
import { MethodSelector } from "./MethodSelector";
import { UrlInput } from "./UrlInput";
import { ParamsTable } from "./ParamsTable";
import { HeadersTable } from "./HeadersTable";

interface Param {
    key: string;
    value: string;
}

interface Header {
    key: string;
    value: string;
}

export function RequestPanel() {
    const [method, setMethod] = useState("GET");
    const [baseUrl, setBaseUrl] = useState("");
    const [params, setParams] = useState<Param[]>([{ key: "", value: "" }])
    const [headers, setHeaders] = useState<Header[]>([
        { key: "Content-Type", value: "application/json"},
    ]);

    // Build final URL with query parameters (auto-update)
    const fullUrl = useMemo(() => {
        const urlObj = new URL(baseUrl || "https://example.com");

        // Remove existing query params first
        urlObj.search = "";
        params.forEach((p) => {
            if (p.key.trim() !== "") {
                urlObj.searchParams.append(p.key, p.value);
            }
        });

        return urlObj.toString();

    }, [baseUrl, params]);

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            {/* Request line: method + URL + (future Send button) */}
            <div className="flex gap-3 items-start">
                <MethodSelector method={method} onChange={setMethod} />
                <UrlInput url={baseUrl} onChange={setBaseUrl} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Send
                </button>
            </div>

            {/* Tabs area (Params / Headers / Body – Body will be later) */}
            <div className="mt-6 border-b">
                <nav className="flex gap-4">
                <button className="px-1 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
                    Params
                </button>
                <button className="px-1 py-2 text-gray-500 hover:text-gray-700">
                    Headers
                </button>
                <button className="px-1 py-2 text-gray-500 hover:text-gray-700">
                    Body
                </button>
                </nav>
            </div>

            {/* Params panel (visible for now) */}
            <div className="mt-4">
                <ParamsTable params={params} onChange={setParams} />
            </div>

            {/* Headers panel (visible for now – in real tab you'd toggle) */}
            <div className="mt-4">
                <HeadersTable headers={headers} onChange={setHeaders} />
            </div>

            {/* Optional: Show the final URL for debugging */}
            {baseUrl && (
                <div className="mt-4 p-2 bg-gray-50 rounded text-xs font-mono text-gray-500">
                    Final URL: {fullUrl}
                </div>
            )}
        </div>
    );      
}