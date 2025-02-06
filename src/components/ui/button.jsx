// src/components/ui/button.jsx
export function Button({ children, className = '', variant = 'default', size = 'default', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium
        ${variant === 'ghost' ? 'text-gray-500 hover:bg-gray-100' : ''}
        ${size === 'icon' ? 'h-8 w-8' : 'px-4 py-2'}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}