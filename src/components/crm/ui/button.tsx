// @ts-nocheck

import React from 'react';

const Button = React.forwardRef (({ type = "button", className = "", children, ...props }, ref) => {
    return (
        <button
            type={type}
            ref={ref}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className} hover:bg-orange-600 text-white`}
            {...props}
            >
            {children}
        </button>
    );
});

export default Button;