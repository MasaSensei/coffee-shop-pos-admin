import { useState } from "preact/hooks";
import { ChevronDown, ChevronRight } from "lucide-preact";

export function DataTable({
  columns,
  data,
  loading,
  emptyMessage = "Data tidak ditemukan",
}) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-50">
              <th className="w-14 px-6 py-6"></th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {data.map((row) => (
              <>
                <tr
                  key={row.id}
                  className={`hover:bg-stone-50/50 transition-colors group ${
                    expandedRows[row.id] ? "bg-stone-50/40" : ""
                  }`}
                >
                  <td className="px-6 py-5">
                    {row.variants?.length > 0 && (
                      <button
                        onClick={() => toggleRow(row.id)}
                        className={`p-2 rounded-xl transition-all ${
                          expandedRows[row.id]
                            ? "bg-coffee-800 text-white"
                            : "bg-stone-100 text-stone-400 hover:text-coffee-800"
                        }`}
                      >
                        {expandedRows[row.id] ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                    )}
                  </td>
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-6 py-5 text-sm ${col.className || ""}`}
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

                {/* Sub-Table for Variants */}
                {expandedRows[row.id] && row.variants && (
                  <tr className="bg-stone-50/30 animate-in slide-in-from-top-2 duration-300">
                    <td colSpan={columns.length + 1} className="px-14 py-6">
                      <div className="flex flex-col gap-2 border-l-4 border-amber-100 pl-8 py-2">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">
                          Detail Harga Varian
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {row.variants.map((v) => (
                            <div
                              key={v.id}
                              className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex justify-between items-center"
                            >
                              <span className="font-black text-xs text-stone-600 uppercase">
                                {v.name}
                              </span>
                              <span className="font-black text-sm text-coffee-900">
                                Rp {v.price?.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
