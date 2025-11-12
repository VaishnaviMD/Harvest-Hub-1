import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  );
}

