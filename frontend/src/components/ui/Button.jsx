export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full py-3 px-4 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-coffee-900/20 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
