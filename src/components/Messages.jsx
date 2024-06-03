import React from "react";
const Messages = ({ message, type = "error" }) => (
  <div className="py-2 px-3">
    <span
      className={
        type === "error"
          ? "text-red-600 text-sm"
          : type === "success"
          ? "text-emerald-400"
          : "text-amber-400"
      }
    >
      {message}
    </span>
  </div>
);

export default Messages;
