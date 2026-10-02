import React, { useEffect } from "react";

const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => { 
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      className={`
        fixed
        right-6
        top-6
        z-[99999]
        flex
        min-w-[320px]
        max-w-[450px]
        items-start
        gap-3
        rounded-lg
        border
        px-4
        py-3
        shadow-lg
        transition-all
        duration-300
        ${
          isSuccess
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          mt-0.5
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          text-sm
          font-bold
          ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        `}
      >
        {isSuccess ? "✓" : "!"}
      </div>

      {/* Message */}
      <p className="flex-1 text-sm font-medium">
        {message}
      </p>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className={`
          text-lg
          leading-none
          transition
          ${
            isSuccess
              ? "text-green-500 hover:text-green-800"
              : "text-red-500 hover:text-red-800"
          }
        `}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;