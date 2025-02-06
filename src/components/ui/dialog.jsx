import * as React from "react"

export function Dialog({ children, open, onOpenChange }) {
  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="bg-white rounded-lg p-6" 
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogTrigger({ children, asChild }) {
  return children;
}

export function DialogContent({ children, onClose }) {
  return <div className="w-96">{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}