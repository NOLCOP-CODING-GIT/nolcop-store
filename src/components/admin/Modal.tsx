import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-blanc w-full max-w-xl rounded-2xl border border-gris-canon-de-fusil/5 shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gris-canon-de-fusil/5 shrink-0">
          <h3 className="text-base font-black text-gris-canon-de-fusil">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil hover:bg-gris-canon-de-fusil/5 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
