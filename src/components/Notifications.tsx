import React from "react";
import { useNotification } from "../hooks/useNotification";
import { type NotificationType } from "../contexts/NotificationContext";
import { X } from "lucide-react";

const alertStyles: Record<
  NotificationType,
  { bg: string; text: string; border: string; iconColor: string }
> = {
  success: {
    bg: "var(--color-vert-jungle)",
    text: "var(--color-blanc)",
    border: "transparent",
    iconColor: "var(--color-blanc)",
  },
  error: {
    bg: "var(--color-rouge-ecarlate)",
    text: "var(--color-blanc)",
    border: "transparent",
    iconColor: "var(--color-blanc)",
  },
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-xs w-auto pointer-events-none py-3">
      {notifications.map((notif) => {
        const style = alertStyles[notif.type];
        return (
          <div
            key={notif.id}
            style={{
              backgroundColor: style.bg,
              color: style.text,
              borderColor: style.border,
            }}
            className="pointer-events-auto flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg shadow-md border text-xs transition-all duration-300"
          >
            <div className="flex items-center gap-2 min-w-0">
              <p className="font-semibold leading-tight truncate">
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="p-0.5 rounded-md hover:bg-black/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Fermer"
            >
              <X />
            </button>
          </div>
        );
      })}
    </div>
  );
};
