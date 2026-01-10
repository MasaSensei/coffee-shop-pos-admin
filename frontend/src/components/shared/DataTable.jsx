export function DataTable({
  columns,
  data,
  loading,
  emptyMessage = "Data tidak ditemukan",
}) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-[32px] p-20 flex flex-col items-center justify-center gap-4 border border-stone-100">
        <div className="w-12 h-12 border-4 border-stone-100 border-t-coffee-800 rounded-full animate-spin"></div>
        <p className="text-xs font-black text-stone-400 uppercase tracking-widest">
          Sinkronisasi Data...
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-stone-50 rounded-[32px] p-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-stone-200">
        <p className="text-stone-400 font-bold uppercase tracking-tight">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-50">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-8 py-6 text-left text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-stone-50/50 transition-colors group"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-8 py-5 text-sm ${col.className || ""}`}
                  >
                    {col.render ? (
                      col.render(row)
                    ) : (
                      <span className="font-bold text-stone-700">
                        {row[col.accessor]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
