import { Plus, Trash2, Banknote, Type } from "lucide-preact";

export function VariantManager({ variants = [], onChange }) {
  const addVariant = () => {
    onChange([...variants, { name: "", price: 0 }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] =
      field === "price" ? parseInt(value) || 0 : value;
    onChange(newVariants);
  };

  const removeVariant = (index) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pt-4 border-t-2 border-dashed border-stone-100">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">
          Konfigurasi Varian & Harga
        </label>
        <button
          type="button"
          onClick={addVariant}
          className="text-[9px] font-black bg-coffee-100 text-coffee-800 px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-coffee-800 hover:text-white transition-all flex items-center gap-1"
        >
          <Plus size={12} /> Tambah Varian
        </button>
      </div>

      <div className="space-y-3">
        {variants.map((v, index) => (
          <div
            key={index}
            className="flex gap-3 animate-in slide-in-from-left-2 duration-300"
          >
            {/* Input Nama Varian */}
            <div className="relative flex-[2]">
              <Type
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"
                size={16}
              />
              <input
                type="text"
                value={v.name}
                onInput={(e) => updateVariant(index, "name", e.target.value)}
                placeholder="NAMA (EX: HOT/ICED)"
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-coffee-800 focus:bg-white transition-all"
              />
            </div>

            {/* Input Harga */}
            <div className="relative flex-[2]">
              <Banknote
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"
                size={16}
              />
              <input
                type="number"
                value={v.price}
                onInput={(e) => updateVariant(index, "price", e.target.value)}
                placeholder="HARGA"
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl text-[11px] font-black outline-none focus:border-coffee-800 focus:bg-white transition-all"
              />
            </div>

            {/* Tombol Hapus */}
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="p-4 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {variants.length === 0 && (
          <div className="py-8 text-center border-2 border-dashed border-stone-50 rounded-[28px]">
            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
              Belum ada varian harga
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
