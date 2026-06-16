"use client";
import React, { useState, useRef, useEffect} from "react";
import RequestEditor from "./RequestEditor";
import { RequestState, SavedRequest } from "@/lib/types";

interface Props {
  initialRequest?: SavedRequest | null;
  onSaveToHistory: (request: SavedRequest) => void;
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 6);

const createEmptyRequest = (): RequestState => ({
  id: generateId(),
  name: "New Request",
  method: "GET",
  url: "",
  params: [{ key: "", value: "" }],
  headers: [{ key: "Content-Type", value: "application/json" }],
  body: "",
});

const savedRequestToState = (req: SavedRequest): RequestState => ({
  id: generateId(),
  name: req.name,
  method: req.method,
  url: req.url,
  params: req.params.length ? req.params : [{ key: "", value: "" }],
  headers: req.headers.length ? req.headers : [{ key: "Content-Type", value: "application/json" }],
  body: req.body || "",
});

export const TabbedRequestView = React.memo(function TabbedRequestView({
  initialRequest,
  onSaveToHistory,
}: Props) {
  const [tabs, setTabs] = useState<RequestState[]>(() => {
    if (initialRequest) {
      return [savedRequestToState(initialRequest)];
    }
    return [createEmptyRequest()];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0]?.id || generateId());
  const prevRequestIdRef = useRef<string | null>(initialRequest?.id || null);

  useEffect(() => {
    if (initialRequest && initialRequest.id !== prevRequestIdRef.current) {
      const newTab = savedRequestToState(initialRequest);
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
      prevRequestIdRef.current = initialRequest.id;
    }
  }, [initialRequest]);

  const addTab = () => {
    const newTab = createEmptyRequest();
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const updateTab = (id: string, updatedRequest: RequestState) => {
    setTabs(tabs.map((tab) => (tab.id === id ? updatedRequest : tab)));
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  if (!activeTab) return null;

  const getTabDisplayName = (tab: RequestState) => {
    if (tab.name !== "New Request") return tab.name;
    const shortUrl = tab.url
      ? tab.url.length > 30
        ? tab.url.substring(0, 27) + "..."
        : tab.url
      : "New Request";
    return `${tab.method} ${shortUrl}`;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center px-4 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer whitespace-nowrap ${
              activeTabId === tab.id
                ? "bg-white dark:bg-gray-900 border-b-2 border-b-blue-500 dark:border-b-blue-400 -mb-px"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="text-sm font-medium truncate max-w-[150px] text-gray-800 dark:text-gray-200">
              {getTabDisplayName(tab)}
            </span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addTab}
          className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
        >
          + New Tab
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <RequestEditor
          request={activeTab}
          onRequestChange={(updated) => updateTab(activeTabId, updated)}
          onSaveToHistory={onSaveToHistory}
        />
      </div>
    </div>
  );
});