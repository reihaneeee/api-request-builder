// src/components/CollectionsList.tsx
"use client";
import { useState, useRef } from "react";
import { Collection, SavedRequest } from "@/lib/types";
import { CollectionItem } from "./CollectionItem";

interface Props {
  collections: Collection[];
  onSelectRequest: (request: SavedRequest) => void;
  onAddCollection: () => void;
  onToggleFavorite: (id: string) => void;
  onRename: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onSort: (id: string) => void;
  onAddRequest: (id: string) => void;
  onAddFolder: (id: string) => void;
  onRenameRequest: (collectionId: string, requestId: string) => void;
  onDuplicateRequest: (collectionId: string, requestId: string) => void;
  onDeleteRequest: (collectionId: string, requestId: string) => void;
  onCopyRequest: (collectionId: string, requestId: string) => void;
  onAddRequestToFolder: (collectionId: string, folderId: string) => void; 
  onExport: (id: string) => void;
  onImport: (file: File) => void; 
}

export function CollectionsList({
  collections,
  onSelectRequest,
  onAddCollection,
  onToggleFavorite,
  onRename,
  onDuplicate,
  onDelete,
  onSort,
  onAddRequest,
  onAddFolder,
  onRenameRequest,
  onDuplicateRequest,
  onDeleteRequest,
  onCopyRequest,
  onAddRequestToFolder,
  onExport,
  onImport,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCollections = collections.filter((col) => {
    const lowerSearch = searchTerm.toLowerCase();    
    if (col.name.toLowerCase().includes(lowerSearch)) return true;
        return col.requests.some((req) =>
        req.name.toLowerCase().includes(lowerSearch)
    );
  });

  // Sort: favorites first, then by name
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = ""; // reset input
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Collections</h3>
        <button
          onClick={onAddCollection}
          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
          + New
        </button>
        <button
            onClick={() => fileInputRef.current?.click()}
            className="text-green-600 dark:text-green-400 text-sm hover:underline"
          >
            Import
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
      </div>

      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search collections, folders, requests..."
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

      {sortedCollections.map((collection) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          onSelectRequest={onSelectRequest}
          onToggleFavorite={onToggleFavorite}
          onRename={onRename}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onSort={onSort}
          onAddRequest={onAddRequest}
          onAddFolder={onAddFolder}
          onRenameRequest={onRenameRequest}
          onDuplicateRequest={onDuplicateRequest}
          onDeleteRequest={onDeleteRequest}
          onCopyRequest={onCopyRequest}
          onAddRequestToFolder={onAddRequestToFolder}
          onExport={onExport} 
        />
      ))}
      {sortedCollections.length === 0 && (
        <div className="text-sm text-gray-400 dark:text-gray-500 italic px-2">
          {searchTerm ? "No matching collections found" : "No collections yet. Click '+ New' to create one."}
        </div>
      )}
    </div>
  );
}