import React from "react";

export const Select = ({ children, onValueChange }) => {
  return (
    <select
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded-lg p-2 w-full"
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children }) => {
  return <>{children}</>;
};

export const SelectContent = ({ children }) => {
  return <>{children}</>;
};

export const SelectItem = ({ children, value }) => {
  return <option value={value}>{children}</option>;
};

export const SelectValue = ({ placeholder }) => {
  return <option value="">{placeholder}</option>;
};
