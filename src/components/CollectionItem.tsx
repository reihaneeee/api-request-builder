// src/components/CollectionItem.tsx
"use client";
import { useState } from "react";
import { Collection, SavedRequest } from "@/lib/types";
import { RequestItem } from "./RequestItem";
import ContextMenu from "./ContextMenu";

interface Props {
  collection: Collection;
  onSelectRequest: (request: SavedRequest) => void;
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
}

export function CollectionItem({
  collection,
  onSelectRequest,
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
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleMenuOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  // تشخیص پوشه بودن بر اساس نام (شروع با 📁)
  const isFolder = (req: SavedRequest) => req.name.startsWith("📁");

  return (
    <div className="mb-2">
      {/* Header of collection */}
      <div className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
        <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {isOpen ? "▼" : "▶"}
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {collection.name}
          </span>
          {collection.isFavorite && (
            <span className="text-yellow-500 text-sm">★</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddRequest(collection.id);
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-bold px-1"
            title="Add request"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(collection.id);
            }}
            className={`text-sm ${collection.isFavorite ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
          >
            ★
          </button>
          <button
            onClick={handleMenuOpen}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            ⠿
          </button>
        </div>
      </div>

      {/* Requests inside collection */}
      {isOpen && (
        <div className="ml-6 mt-1">
          {collection.requests.map((req) => (
            <RequestItem
              key={req.id}
              request={req}
              onSelect={onSelectRequest}
              onRename={(id) => onRenameRequest(collection.id, id)}
              onDuplicate={(id) => onDuplicateRequest(collection.id, id)}
              onDelete={(id) => onDeleteRequest(collection.id, id)}
              onCopy={(id) => onCopyRequest(collection.id, id)}
              isFolder={isFolder(req)}
              onAddRequestToFolder={
                isFolder(req)
                  ? (folderId) => onAddRequestToFolder(collection.id, folderId)
                  : undefined
              }
            />
          ))}
          {collection.requests.length === 0 && (
            <div className="px-3 py-1 text-xs text-gray-400 dark:text-gray-500 italic">
              No requests yet
            </div>
          )}
        </div>
      )}

      {/* Context menu for collection */}
      <ContextMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        position={menuPosition}
        items={[
          { label: "Add Request", onClick: () => onAddRequest(collection.id) },
          { label: "Add Folder", onClick: () => onAddFolder(collection.id) },
          { label: "Rename", onClick: () => onRename(collection.id) },
          { label: "Duplicate", onClick: () => onDuplicate(collection.id) },
          { label: "Sort", onClick: () => onSort(collection.id) },
          { label: "Export", onClick: () => onExport(collection.id) }, 
          { label: "Delete", onClick: () => onDelete(collection.id), danger: true },
        ]}
      />
    </div>
  );
}