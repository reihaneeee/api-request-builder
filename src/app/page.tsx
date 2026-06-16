"use client";
import { useState, useCallback } from "react";
import { TabbedRequestView } from "@/components/TabbedRequestView";
import { ThemeToggle } from "@/components/ThemToggle";
import { Sidebar } from "@/components/Sidebar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SavedRequest, Collection } from "@/lib/types";

export default function Home() {
  const [history, setHistory] = useLocalStorage<SavedRequest[]>("requestHistory", []);
  const [collections, setCollections] = useLocalStorage<Collection[]>("collections", []);
  const [loadedRequest, setLoadedRequest] = useState<SavedRequest | null>(null);

  const handleLoadRequest = useCallback((request: SavedRequest) => {
    setLoadedRequest(request);
  }, []);

  const saveToHistory = useCallback((request: SavedRequest) => {
    setHistory((prev: SavedRequest[]) => {
      const filtered = prev.filter((r) => r.id !== request.id);
      return [request, ...filtered.slice(0, 49)];
    });
  }, [setHistory]);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }, [setHistory]);

  const addToCollection = useCallback((request: SavedRequest, collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, requests: [...col.requests, { ...request, id: Date.now().toString() }] }
          : col
      )
    );
  }, [setCollections]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">API Request Builder</h1>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <Sidebar
            history={history}
            onLoadRequest={handleLoadRequest}
            onDeleteHistory={deleteFromHistory}
            onAddToCollection={addToCollection}
          />
        </aside>
        <main className="flex-1 overflow-auto">
          <TabbedRequestView initialRequest={loadedRequest} onSaveToHistory={saveToHistory} />
        </main>
      </div>
    </div>
  );
}