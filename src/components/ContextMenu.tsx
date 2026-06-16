// src/components/ContextMenu.tsx
"use client";
import { useRef, useEffect } from "react";

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    label: string;
    onClick: () => void;
    danger?: boolean;
  }>;
  position: { x: number; y: number };
}

export default function ContextMenu({ isOpen, onClose, items, position }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 min-w-[140px] max-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1"
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={`w-full text-left px-3 py-1.5 text-sm whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-700 ${
            item.danger ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}