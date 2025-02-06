export function Alert({ children, className }) {
    return (
      <div
        role="alert"
        className={`relative w-full rounded-lg border p-4 ${className}`}
      >
        {children}
      </div>
    );
  }