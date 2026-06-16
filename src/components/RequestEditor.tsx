// src/components/RequestEditor.tsx
"use client";
import React, { useState, useMemo } from "react";
import { MethodDropdown } from "./MethodDropdown";
import { UrlInput } from "./UrlInput";
import { ParamsTable } from "./ParamsTable";
import { HeadersTable } from "./HeadersTable";
import { BodyEditor } from "./BodyEditor";
import { RequestState, SavedRequest } from "@/lib/types";

interface Props {
  request: RequestState;
  onRequestChange: (updated: RequestState) => void;
  onSaveToHistory: (request: SavedRequest) => void;
}

type Tab = "params" | "headers" | "body";

// Mapping status codes to descriptions
const statusDescriptions: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  304: "Not Modified",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

const RequestEditor = React.memo(function RequestEditor({
  request,
  onRequestChange,
  onSaveToHistory,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("params");
  const [response, setResponse] = useState<{
    status: number | null;
    statusText: string;
    data: unknown;
    error: string | null;
    loading: boolean;
  }>({
    status: null,
    statusText: "",
    data: null,
    error: null,
    loading: false,
  });

  const fullUrl = useMemo(() => {
    if (!request.url) return "";
    try {
      const urlObj = new URL(request.url);
      urlObj.search = "";
      request.params.forEach((p) => {
        if (p.key.trim() !== "") {
          urlObj.searchParams.append(p.key, p.value);
        }
      });
      return urlObj.toString();
    } catch {
      return request.url;
    }
  }, [request.url, request.params]);

  const sendRequest = async () => {
    if (!request.url.trim()) {
      setResponse({
        status: null,
        statusText: "",
        data: null,
        error: "URL cannot be empty",
        loading: false,
      });
      return;
    }
    if (!/^https?:\/\//i.test(request.url)) {
      setResponse({
        status: null,
        statusText: "",
        data: null,
        error: "URL must start with http:// or https://",
        loading: false,
      });
      return;
    }

    setResponse((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const headersObj: Record<string, string> = {};
      request.headers.forEach((h) => {
        if (h.key.trim() !== "") {
          headersObj[h.key] = h.value;
        }
      });

      let requestBody: BodyInit | undefined = undefined;
      if (request.method !== "GET" && request.method !== "HEAD") {
        requestBody = request.body;
      }

      const res = await fetch(fullUrl, {
        method: request.method,
        headers: headersObj,
        body: requestBody,
      });

      let responseData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: responseData,
        error: null,
        loading: false,
      });

      const savedRequest: SavedRequest = {
        id: request.id,
        name: request.name !== "New Request" ? request.name : `${request.method} ${request.url}`,
        method: request.method,
        url: fullUrl,
        params: request.params.filter((p) => p.key.trim() !== ""),
        headers: request.headers.filter((h) => h.key.trim() !== ""),
        body: request.body,
        timestamp: Date.now(),
      };
      onSaveToHistory(savedRequest);
    } catch (err) {
      let errorMessage = "Network error or server unreachable";
      if (err instanceof Error) {
        // Customize the "Failed to fetch" message
        if (err.message === "Failed to fetch") {
          errorMessage = "Network error or server unreachable";
        } else {
          errorMessage = err.message;
        }
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setResponse({
        status: null,
        statusText: "",
        data: null,
        error: errorMessage,
        loading: false,
      });
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400";
    if (status >= 300 && status < 400) return "text-yellow-600 dark:text-yellow-400";
    if (status >= 400 && status < 500) return "text-orange-600 dark:text-orange-400";
    if (status >= 500) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const updateRequest = (updates: Partial<RequestState>) => {
    onRequestChange({ ...request, ...updates });
  };

  // Clear All function
  const clearAll = () => {
    updateRequest({
      method: "GET",
      url: "",
      params: [{ key: "", value: "" }],
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: "",
    });
    setResponse({
      status: null,
      statusText: "",
      data: null,
      error: null,
      loading: false,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <MethodDropdown method={request.method} onChange={(m) => updateRequest({ method: m })} />
        <div className="flex-1 w-full">
          <UrlInput url={request.url} onChange={(url) => updateRequest({ url })} />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={sendRequest}
            disabled={response.loading}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 dark:disabled:bg-blue-800"
          >
            {response.loading ? "Sending..." : "Send"}
          </button>
          <button
            onClick={clearAll}
            className="flex-1 sm:flex-none bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {(["params", "headers", "body"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-2 font-medium capitalize ${
                activeTab === tab
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "params" && (
          <ParamsTable params={request.params} onChange={(params) => updateRequest({ params })} />
        )}
        {activeTab === "headers" && (
          <HeadersTable headers={request.headers} onChange={(headers) => updateRequest({ headers })} />
        )}
        {activeTab === "body" && (
          <BodyEditor body={request.body} onChange={(body) => updateRequest({ body })} />
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Response</h3>
        {response.loading && <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400">Loading...</div>}
        {response.error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
            <strong>Error:</strong> {response.error}
          </div>
        )}
        {response.status && (
          <div className="mb-3">
            <span className={`font-bold ${getStatusColor(response.status)}`}>
              Status: {response.status} {response.statusText}
              {statusDescriptions[response.status] && (
                <span className="font-normal text-gray-600 dark:text-gray-400 ml-2">
                  ({statusDescriptions[response.status]})
                </span>
              )}
            </span>
          </div>
        )}
        {response.data !== null && response.data !== undefined && !response.error && (
          <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {typeof response.data === "object"
                ? JSON.stringify(response.data, null, 2)
                : String(response.data)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
});

export default RequestEditor;