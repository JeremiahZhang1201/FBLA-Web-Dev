// src/components/ui/button.js
import React from 'react';

export function Button({
  children,
  onClick,
  className = '',
  variant = 'default',
  ...props
}) {
  let variantClasses = '';

  if (variant === 'default') {
    variantClasses = 'bg-blue-500 text-white hover:bg-blue-600';
  } else if (variant === 'outline') {
    variantClasses = 'border border-blue-500 text-blue-500 hover:bg-blue-50';
  } else if (variant === 'destructive') {
    variantClasses = 'bg-red-500 text-white hover:bg-red-600';
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
