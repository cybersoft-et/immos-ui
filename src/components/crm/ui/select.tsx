import React from 'react';

const Select = React.forwardRef(({ label, options = [], className = "", ...props }, ref) => {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <select
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${className}`}
                ref={ref}
                {...props}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default Select;