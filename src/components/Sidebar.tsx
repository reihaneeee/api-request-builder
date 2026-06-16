// src/components/Sidebar.tsx
"use client";
import React, { useState } from "react";
import { HistoryList } from "./HistoryList";
import { CollectionsList } from "./CollectionList";
import InputDialog from "./InputDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SavedRequest, Collection } from "@/lib/types";

interface Props {
  history: SavedRequest[];
  onLoadRequest: (request: SavedRequest) => void;
  onDeleteHistory: (id: string) => void; 
  onAddToCollection: (request: SavedRequest, collectionId: string) => void; 
}

export const Sidebar = React.memo(function Sidebar({ 
    history, 
    onLoadRequest,
    onDeleteHistory,
    onAddToCollection, 
    }: Props) {
        
  const [activeTab, setActiveTab] = useState<"history" | "collections">("history");
  const [collections, setCollections] = useLocalStorage<Collection[]>("collections", []);

  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    initialValue: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: "",
    initialValue: "",
    onConfirm: () => {},
  });

  const closeDialog = () => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const showDialog = (title: string, initialValue: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setDialogConfig({
        isOpen: true,
        title,
        initialValue,
        onConfirm: (value) => {
          resolve(value);
          closeDialog();
        },
      });
    });
  };

  const addCollection = async () => {
    const name = await showDialog("New Collection", "");
    if (name) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name,
        isFavorite: false,
        requests: [],
      };
      setCollections([...collections, newCollection]);
    }
  };

  const renameCollection = async (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (!collection) return;
    const newName = await showDialog("Rename Collection", collection.name);
    if (newName) {
      setCollections(
        collections.map((c) =>
          c.id === id ? { ...c, name: newName } : c
        )
      );
    }
  };

  const addRequestToCollection = async (collectionId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;
    const name = await showDialog("New Request", "Enter request name...");
    if (name) {
      const newRequest: SavedRequest = {
        id: Date.now().toString(),
        name,
        method: "GET",
        url: "",
        params: [],
        headers: [],
        body: "",
        timestamp: Date.now(),
      };
      setCollections(
        collections.map((c) =>
          c.id === collectionId
            ? { ...c, requests: [...c.requests, newRequest] }
            : c
        )
      );
    }
  };

  const addFolderToCollection = async (collectionId: string) => {
    const name = await showDialog("New Folder", "");
    if (name) {
      const folderRequest: SavedRequest = {
        id: Date.now().toString() + "_folder",
        name: `📁 ${name}`,
        method: "GET",
        url: "",
        params: [],
        headers: [],
        body: "",
        timestamp: Date.now(),
      };
      setCollections(
        collections.map((c) =>
          c.id === collectionId
            ? { ...c, requests: [...c.requests, folderRequest] }
            : c
        )
      );
    }
  };

  const addRequestToFolder = async (collectionId: string, folderId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;
    const folder = collection.requests.find((r) => r.id === folderId);
    if (!folder || !folder.name.startsWith("📁")) return;

    const name = await showDialog(
      `Add Request to "${folder.name.replace('📁 ', '')}"`,
      "Enter request name..."
    );
    if (name) {
      const newRequest: SavedRequest = {
        id: Date.now().toString(),
        name,
        method: "GET",
        url: "",
        params: [],
        headers: [],
        body: "",
        timestamp: Date.now(),
      };
      const folderIndex = collection.requests.findIndex((r) => r.id === folderId);
      const updatedRequests = [...collection.requests];
      updatedRequests.splice(folderIndex + 1, 0, newRequest);
      setCollections(
        collections.map((c) =>
          c.id === collectionId
            ? { ...c, requests: updatedRequests }
            : c
        )
      );
    }
  };

  const renameRequest = async (collectionId: string, requestId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;
    const request = collection.requests.find((r) => r.id === requestId);
    if (!request) return;
    const newName = await showDialog("Rename Request", request.name);
    if (newName) {
      setCollections(
        collections.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                requests: c.requests.map((r) =>
                  r.id === requestId ? { ...r, name: newName } : r
                ),
              }
            : c
        )
      );
    }
  };

  const duplicateRequest = (collectionId: string, requestId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;
    const request = collection.requests.find((r) => r.id === requestId);
    if (!request) return;
    const newRequest: SavedRequest = {
      ...request,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      name: request.name + " (Copy)",
      timestamp: Date.now(),
    };
    setCollections(
      collections.map((c) =>
        c.id === collectionId
          ? { ...c, requests: [...c.requests, newRequest] }
          : c
      )
    );
  };

  const deleteRequest = (collectionId: string, requestId: string) => {
    if (!confirm("Delete this request?")) return;
    setCollections(
      collections.map((c) =>
        c.id === collectionId
          ? { ...c, requests: c.requests.filter((r) => r.id !== requestId) }
          : c
      )
    );
  };

  const copyRequest = (collectionId: string, requestId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;
    const request = collection.requests.find((r) => r.id === requestId);
    if (!request) return;
    navigator.clipboard?.writeText(request.url || request.name);
    alert("Request details copied to clipboard!");
  };

  const duplicateCollection = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (!collection) return;
    const newCollection: Collection = {
      ...collection,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      name: collection.name + " (Copy)",
      isFavorite: false,
    };
    setCollections([...collections, newCollection]);
  };

  const deleteCollection = (id: string) => {
    if (confirm("Delete this collection and all its requests?")) {
      setCollections(collections.filter((c) => c.id !== id));
    }
  };

  const sortCollection = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (!collection) return;
    const sortedRequests = [...collection.requests].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setCollections(
      collections.map((c) =>
        c.id === id ? { ...c, requests: sortedRequests } : c
      )
    );
  };

  const toggleFavorite = (id: string) => {
    setCollections(
      collections.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  };

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === "history"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === "collections"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Collections
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === "history" && (
            <HistoryList 
                history={history} 
                collections={collections}
                onSelect={onLoadRequest} 
                onDeleteHistory={onDeleteHistory}
                onAddToCollection={onAddToCollection}
                />
          )}
          {activeTab === "collections" && (
            <CollectionsList
              collections={collections}
              onSelectRequest={onLoadRequest}
              onAddCollection={addCollection}
              onToggleFavorite={toggleFavorite}
              onRename={renameCollection}
              onDuplicate={duplicateCollection}
              onDelete={deleteCollection}
              onSort={sortCollection}
              onAddRequest={addRequestToCollection}
              onAddFolder={addFolderToCollection}
              onRenameRequest={renameRequest}
              onDuplicateRequest={duplicateRequest}
              onDeleteRequest={deleteRequest}
              onCopyRequest={copyRequest}
              onAddRequestToFolder={addRequestToFolder}
            />
          )}
        </div>
      </div>

      <InputDialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        initialValue={dialogConfig.initialValue}
        placeholder="Enter name..."
        onConfirm={dialogConfig.onConfirm}
        onCancel={closeDialog}
      />
    </>
  );
});