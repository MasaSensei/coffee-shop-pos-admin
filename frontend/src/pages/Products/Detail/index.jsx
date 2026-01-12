import { useState } from "preact/hooks";
import {
  ArrowLeft,
  FlaskConical,
  Trash2,
  Save,
  Scale,
  Plus,
  ChevronRight,
  AlertCircle,
} from "lucide-preact";
import { useProductRecipe } from "../../../hooks/useProductRecipe";
import { toast } from "sonner";

export function ProductRecipe({ id }) {
  // 1. Ambil fungsi manipulasi & saveRecipe dari Hook
  const {
    product,
    ingredients,
    loading,
    error,
    isSaving, // Gunakan isSaving dari hook
    loadVariantRecipe,
    addIngredientToVariant, // Gunakan fungsi terpusat
    removeIngredientFromVariant, // Gunakan fungsi terpusat
    updateIngredientInVariant, // Gunakan fungsi terpusat
    saveRecipe, // INI KUNCINYA agar tidak jadi string
  } = useProductRecipe(id);

  const [activeVariantTab, setActiveVariantTab] = useState(0);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 bg-[#FAF9F6] min-h-screen">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-900 rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
          Brewing Data...
        </span>
      </div>
    );

  if (error || !product)
    return (
      <div className="p-20 text-center bg-[#FAF9F6] min-h-screen">
        <AlertCircle className="mx-auto text-red-800 mb-4" size={40} />
        <p className="font-black text-stone-800 uppercase text-sm mb-4">
          {error || "Produk tidak ditemukan"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-stone-900 text-white rounded-2xl font-bold text-xs"
        >
          RETRY
        </button>
      </div>
    );

  const activeVariant = product.variants[activeVariantTab];
  const activeRecipes = activeVariant?.recipes || [];

  const handleSwitchVariant = (index) => {
    setActiveVariantTab(index);
    loadVariantRecipe(index);
  };

  // 2. Fungsi Save sekarang memanggil saveRecipe dari Hook
  const onSave = async () => {
    if (activeRecipes.length === 0) return toast.error("Resep belum diisi");

    // saveRecipe di dalam Hook sudah melakukan: Number(value)
    const result = await saveRecipe(activeVariantTab);

    if (result.success) {
      toast.success("Formula berhasil disinkronkan ke Integer");
    } else {
      toast.error("Gagal sinkronisasi: " + result.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <button
          onClick={() => window.history.back()}
          className="p-4 bg-white border border-stone-200 rounded-2xl hover:bg-stone-50 transition-all shadow-sm group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform text-stone-600"
          />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical size={14} className="text-orange-700" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
              Roastery Lab System
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-stone-900">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">
            Signature Variants
          </h3>
          <div className="space-y-2">
            {product.variants.map((v, index) => (
              <button
                key={v.id}
                onClick={() => handleSwitchVariant(index)}
                className={`w-full flex items-center justify-between p-6 rounded-[24px] border-2 transition-all ${
                  activeVariantTab === index
                    ? "bg-[#2C2420] border-[#2C2420] text-[#F5F2ED] shadow-xl"
                    : "bg-white border-stone-100 text-stone-400 hover:border-orange-200"
                }`}
              >
                <span className="font-bold uppercase text-xs tracking-tight text-left">
                  {v.variant_name ||
                    v.name ||
                    v.variant_type ||
                    `Variant ${index + 1}`}
                </span>
                <ChevronRight
                  size={18}
                  className={
                    activeVariantTab === index
                      ? "opacity-100 text-orange-400"
                      : "opacity-0"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-[#FAF9F6] border border-stone-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-800">
                  <Scale size={20} />
                </div>
                <h3 className="text-xl font-black uppercase text-stone-900 tracking-tight">
                  Formula Composition
                </h3>
              </div>
              <button
                onClick={() => addIngredientToVariant(activeVariantTab)}
                className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-orange-900 transition-colors"
              >
                <Plus size={14} /> Add Material
              </button>
            </div>

            <div className="space-y-5">
              {activeRecipes.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-stone-200 rounded-[32px] text-stone-300 font-black uppercase text-[10px] tracking-widest">
                  No Recipe Established
                </div>
              ) : (
                activeRecipes.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-end group animate-in slide-in-from-bottom-2"
                  >
                    <div className="flex-1 space-y-2">
                      <label className="text-[9px] font-black text-stone-400 uppercase ml-1">
                        Raw Ingredient
                      </label>
                      <select
                        value={item.ingredient_id}
                        onChange={(e) =>
                          updateIngredientInVariant(
                            activeVariantTab,
                            idx,
                            "ingredient_id",
                            e.target.value
                          )
                        }
                        className="w-full p-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-bold uppercase outline-none focus:border-orange-800 transition-all shadow-sm"
                      >
                        <option value="">Select Ingredient...</option>
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name} ({ing.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-36 space-y-2">
                      <label className="text-[9px] font-black text-stone-400 uppercase ml-1">
                        Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          value={item.quantity_needed}
                          onChange={(e) =>
                            updateIngredientInVariant(
                              activeVariantTab,
                              idx,
                              "quantity_needed",
                              e.target.value
                            )
                          }
                          className="w-full p-4 bg-white border border-stone-200 rounded-2xl text-xs font-black outline-none focus:border-orange-800 transition-all tabular-nums"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-orange-800/40 uppercase">
                          {ingredients.find(
                            (i) => String(i.id) === String(item.ingredient_id)
                          )?.unit || "-"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeIngredientFromVariant(activeVariantTab, idx)
                      }
                      className="mb-1 p-4 text-stone-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-50">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#2C2420] text-[#F5F2ED] rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] hover:scale-105 transition-all shadow-2xl disabled:opacity-50"
        >
          {isSaving ? (
            "Synchronizing..."
          ) : (
            <>
              <Save size={16} /> Update Formula
            </>
          )}
        </button>
      </div>
    </div>
  );
}
