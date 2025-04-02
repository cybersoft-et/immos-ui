import React from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {children}
      </div>
    </div>
  );
};

export const DialogTrigger = ({ children, onClick }) => {
  return <div onClick={onClick}>{children}</div>;
};

export const DialogContent = ({ children }) => {
  return <div className="mt-4">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

export const DialogFooter = ({ children }) => {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
};
