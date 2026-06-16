// src/components/RequestItem.tsx
"use client";
import { useState } from "react";
import { SavedRequest } from "@/lib/types";
import ContextMenu from "./ContextMenu";

interface Props {
  request: SavedRequest;
  onSelect: (request: SavedRequest) => void;
  onRename: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  isFolder?: boolean;
  onAddRequestToFolder?: (id: string) => void; 
}

const methodColors: Record<string, string> = {
  GET: "text-green-600 dark:text-green-400",
  POST: "text-blue-600 dark:text-blue-400",
  PUT: "text-orange-600 dark:text-orange-400",
  PATCH: "text-purple-600 dark:text-purple-400",
  DELETE: "text-red-600 dark:text-red-400",
};

export function RequestItem({
  request,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
  onCopy,
  isFolder = false,
  onAddRequestToFolder,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleMenuOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const getMenuItems = () => {
    if (isFolder) {
      const items = [
        { label: "Rename", onClick: () => onRename(request.id) },
        { label: "Sort", onClick: () => onDuplicate(request.id) },
        { label: "Duplicate", onClick: () => onDuplicate(request.id) },
        { label: "Delete", onClick: () => onDelete(request.id), danger: true },
      ];
      if (onAddRequestToFolder) {
        items.push({ label: "Add Request", onClick: () => onAddRequestToFolder(request.id) });
      }
      return items;
    }
    return [
      { label: "Rename", onClick: () => onRename(request.id) },
      { label: "Duplicate", onClick: () => onDuplicate(request.id) },
      { label: "Delete", onClick: () => onDelete(request.id), danger: true },
      { label: "Copy", onClick: () => onCopy(request.id) },
    ];
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer group"
      onClick={() => !isFolder && onSelect(request)}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isFolder ? (
          <span className="text-base">📁</span>
        ) : (
          <span className={`font-bold text-xs ${methodColors[request.method]}`}>
            {request.method}
          </span>
        )}
        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
          {isFolder ? request.name.replace("📁 ", "") : request.name}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* دکمه + فقط برای پوشه‌ها */}
        {isFolder && onAddRequestToFolder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddRequestToFolder(request.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-bold px-1"
            title="Add request to folder"
          >
            +
          </button>
        )}
        <button
          onClick={handleMenuOpen}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
        >
          ⠿
        </button>
      </div>

      <ContextMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        position={menuPosition}
        items={getMenuItems()}
      />
    </div>
  );
}