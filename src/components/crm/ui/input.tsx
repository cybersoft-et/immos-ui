// @ts-nocheck

import React from 'react';

const Input = React.forwardRef(({ label, type = "text", placeholder, className = "", registerName, requiredState = "false", ...props }, ref) => {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${className}`}
                ref={ref}
                {...props}
            />
        </div>
    );
});

export default Input;