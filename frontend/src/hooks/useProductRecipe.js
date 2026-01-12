import { useState, useEffect } from "preact/hooks";
import { recipeService } from "../core/services/recipe.service";

export function useProductRecipe(productId) {
  const [product, setProduct] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);
        const [prodRes, ingRes] = await Promise.all([
          recipeService.getProductDetail(productId),
          recipeService.getIngredients(),
        ]);

        const menuData = prodRes.data;

        if (menuData?.variants?.length > 0) {
          const recipeRes = await recipeService.getByVariant(
            menuData.variants[0].id
          );
          menuData.variants[0].recipes = Array.isArray(recipeRes.data)
            ? recipeRes.data
            : [];
        }

        setProduct(menuData);
        setIngredients(ingRes.data?.data || []);
      } catch (err) {
        setError("Gagal memuat data Lab");
      } finally {
        setLoading(false);
      }
    }
    if (productId) init();
  }, [productId]);

  const loadVariantRecipe = async (variantIndex) => {
    if (product && !product.variants[variantIndex].recipes) {
      try {
        const res = await recipeService.getByVariant(
          product.variants[variantIndex].id
        );
        const updatedProduct = { ...product };
        updatedProduct.variants[variantIndex].recipes = Array.isArray(res.data)
          ? res.data
          : [];
        setProduct(updatedProduct);
      } catch (err) {
        console.error("Gagal load varian");
      }
    }
  };

  // --- FUNGSI BARU UNTUK MANIPULASI STATE LOKAL ---

  // Menambah baris kosong ke resep varian tertentu
  const addIngredientToVariant = (variantIndex) => {
    if (!product) return;
    const updatedProduct = { ...product };
    const currentRecipes = updatedProduct.variants[variantIndex].recipes || [];

    updatedProduct.variants[variantIndex].recipes = [
      ...currentRecipes,
      { ingredient_id: "", quantity_needed: 0 }, // Baris baru
    ];

    setProduct(updatedProduct);
  };

  // Menghapus baris berdasarkan index
  const removeIngredientFromVariant = (variantIndex, ingredientIndex) => {
    const updatedProduct = { ...product };
    updatedProduct.variants[variantIndex].recipes = updatedProduct.variants[
      variantIndex
    ].recipes.filter((_, i) => i !== ingredientIndex);
    setProduct(updatedProduct);
  };

  // Update nilai field (id atau quantity) per baris
  const updateIngredientInVariant = (
    variantIndex,
    ingredientIndex,
    field,
    value
  ) => {
    const updatedProduct = { ...product };
    updatedProduct.variants[variantIndex].recipes[ingredientIndex][field] =
      value;
    setProduct(updatedProduct);
  };

  // Fungsi simpan ke Database (dengan Casting ke Number)
  const saveRecipe = async (variantIndex) => {
    const variant = product.variants[variantIndex];
    if (!variant || !variant.recipes)
      return { success: false, error: "No data" };

    try {
      setIsSaving(true);

      // PROSES CASTING YANG SANGAT PENTING
      const payload = variant.recipes.map((item) => ({
        // Gunakan Number() atau parseInt() untuk menjamin tipe data INT/FLOAT
        menu_variant_id: Number(variant.id),
        ingredient_id: Number(item.ingredient_id),
        quantity_needed: Number(item.quantity_needed),
      }));

      // DEBUG: Cek di console browser, pastikan warnanya BIRU (number), bukan HITAM (string)
      console.log("Payload yang dikirim ke backend:", payload);

      // Panggil .sync sesuai dengan yang ada di service
      await recipeService.sync(payload);

      return { success: true };
    } catch (err) {
      console.error("Save failed:", err);
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    product,
    setProduct,
    ingredients,
    loading,
    isSaving,
    error,
    loadVariantRecipe,
    addIngredientToVariant,
    removeIngredientFromVariant,
    updateIngredientInVariant,
    saveRecipe,
  };
}
