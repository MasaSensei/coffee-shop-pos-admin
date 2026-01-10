export function DynamicForm({
  fields,
  buttonLabel,
  onSubmit,
  register,
  errors,
  isLoading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label className="text-sm font-medium text-stone-700 ml-1">
            {field.label}
          </label>
          <input
            {...register(field.name)}
            type={field.type || "text"}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 bg-white border ${
              errors[field.name] ? "border-red-500" : "border-stone-200"
            } rounded-xl outline-none focus:ring-4 focus:ring-coffee-500/10 focus:border-coffee-500 transition-all`}
          />
          {errors[field.name] && (
            <p className="text-xs text-red-500 ml-1 font-medium">
              {errors[field.name].message}
            </p>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-coffee-900/20 mt-4"
      >
        {isLoading ? "Sedang Menyeduh..." : buttonLabel}
      </button>
    </form>
  );
}
