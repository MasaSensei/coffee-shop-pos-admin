export function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700 ml-1">
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl outline-none focus:ring-4 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all placeholder:text-stone-400"
        {...props}
      />
    </div>
  );
}
