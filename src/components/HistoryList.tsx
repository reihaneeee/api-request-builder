// src/components/HistoryList.tsx
"use client";
import React, { useState, useEffect } from "react";
import { SavedRequest, Collection } from "@/lib/types";


interface Props {
  history: SavedRequest[];
  collections: Collection[];
  onDeleteHistory: (id: string) => void; 
  onSelect: (request: SavedRequest) => void;
  onAddToCollection: (request: SavedRequest, collectionId: string) => void;
}

export function HistoryList({ 
    history,
    collections, 
    onSelect,
    onDeleteHistory,
    onAddToCollection, 
    }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showCollectionPicker, setShowCollectionPicker] = useState<{
    request: SavedRequest | null;
    isOpen: boolean;
  }>({ request: null, isOpen: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // اگر هنوز mount نشده، یک placeholder با همان ساختار نمایش بده
  if (!isMounted) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Request History
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">0</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search history..."
            value=""
            disabled
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          />
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-500 italic px-2">
          Loading...
        </div>
      </div>
    );
  }


  const filteredHistory = history.filter((req) =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups: Record<string, SavedRequest[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  filteredHistory.forEach((req) => {
    const date = new Date(req.timestamp);
    const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let label: string;
    if (dateKey.getTime() === today.getTime()) {
      label = "Today";
    } else if (dateKey.getTime() === yesterday.getTime()) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(req);
  });

  const sortedLabels = Object.keys(groups).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Yesterday") return -1;
    if (b === "Yesterday") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Request History</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">{filteredHistory.length}</span>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search history..."
          value={searchTerm ?? ''}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {sortedLabels.map((label) => (
        <div key={label}>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</div>
          {groups[label].map((req) => (
            <div
              key={req.id}
              className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 group"
            >
              <div
                onClick={() => onSelect(req)}
                className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
              >
                <span className={`font-bold text-xs ${
                  req.method === "GET" ? "text-green-600 dark:text-green-400" :
                  req.method === "POST" ? "text-blue-600 dark:text-blue-400" :
                  req.method === "PUT" ? "text-orange-600 dark:text-orange-400" :
                  req.method === "PATCH" ? "text-purple-600 dark:text-purple-400" :
                  "text-red-600 dark:text-red-400"
                }`}>
                  {req.method}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                  {req.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowCollectionPicker({ request: req, isOpen: true });
                }}
                className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-bold px-1"
                title="Add to collection"
              >
                +
              </button>
              <button
                onClick={() => onDeleteHistory(req.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Delete from history"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}
      {filteredHistory.length === 0 && (
        <div className="text-sm text-gray-400 dark:text-gray-500 italic px-2">
          {searchTerm ? "No matching requests found" : "No requests yet. Send a request to see it here."}
        </div>
      )}

      {/* Collection Picker Dialog (simple) */}
      {showCollectionPicker.isOpen && showCollectionPicker.request && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Add to Collection
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {collections.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">No collections available. Create one first.</p>
              ) : (
                collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      onAddToCollection(showCollectionPicker.request!, col.id);
                      setShowCollectionPicker({ request: null, isOpen: false });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-200"
                  >
                    {col.name} {col.isFavorite && "★"}
                  </button>
                ))
              )}
            </div>
            <button
              onClick={() => setShowCollectionPicker({ request: null, isOpen: false })}
              className="mt-4 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}