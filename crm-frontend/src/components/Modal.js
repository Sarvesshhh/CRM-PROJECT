'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-theme-modal-overlay backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative border border-theme-card-border rounded-2xl shadow-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-modal bg-theme-bg-tertiary">
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-card-border">
          <h3 className="text-lg font-semibold text-theme-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-theme-text-muted hover:text-theme-text-primary transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6 text-theme-text-primary">{children}</div>
      </div>
    </div>,
    document.body
  );
}
