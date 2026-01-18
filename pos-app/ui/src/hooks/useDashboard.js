import { useState, useEffect } from "preact/hooks";
import { productService } from "../services/productService";
import { categoryService } from "../services/category.service";
import { salesService } from "../services/sales.service";
import { outletService } from "../services/outlet.service";
import { shiftService } from "../services/shift.service";

export function useDashboard(user) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [outlet, setOutlet] = useState(null);
  const [activeCat, setActiveCat] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastTransaction, setLastTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [cashAmount, setCashAmount] = useState("");
  const [orderType, setOrderType] = useState("Dine-in");
  const [orderNumber, setOrderNumber] = useState(1);

  // Ambil ID dari localStorage secara reaktif
  const [currentShiftId, setCurrentShiftId] = useState(null);
  const [startingCash, setStartingCash] = useState(0);
  const [totalCashReceived, setTotalCashReceived] = useState(0);

  // 1. Sinkronisasi Shift ID dari LocalStorage saat mount
  useEffect(() => {
    const sId = localStorage.getItem("active_shift_id");
    if (sId) setCurrentShiftId(parseInt(sId));
  }, []);

  // 2. Fetch data hanya jika Shift ID sudah tersedia
  useEffect(() => {
    if (!user?.outlet_id || !currentShiftId) return;

    const fetchData = async () => {
      try {
        const [catRes, prodRes, outletRes, shiftRes] = await Promise.all([
          categoryService.getAll(),
          productService.getAll(),
          outletService.getByID(user.outlet_id),
          shiftService.getByID(currentShiftId),
        ]);

        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
        setOutlet(outletRes.data.data);
        setStartingCash(shiftRes.data.data.starting_cash || 0);
      } catch (err) {
        console.error(err);
        setErrorMsg("Koneksi gagal. Silakan muat ulang halaman.");
      }
    };

    fetchData();
  }, [user?.outlet_id, currentShiftId]); // Re-run saat currentShiftId berubah!

  // --- Actions ---
  const addToCart = (product, variant) => {
    const cartId = `${product.id}-${variant.id}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          cartId,
          id: product.id,
          name: product.name,
          variantName: variant.variant_name,
          price: variant.price,
          qty: 1,
        },
      ];
    });
    setSelectedProduct(null);
  };

  const updateQty = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.cartId === cartId ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const paidNumber =
    paymentMethod === "1" ? parseFloat(cashAmount) || 0 : total;
  const change = Math.max(0, paidNumber - total);

  const handleCheckout = async () => {
    if (!currentShiftId || isProcessing) return;
    setIsProcessing(true);
    try {
      const payload = {
        shift_id: currentShiftId,
        user_id: user.id,
        payment_method_id: parseInt(paymentMethod),
        order_type: orderType,
        amount_paid: paidNumber,
        items: cart.map((i) => ({
          menu_variant_id: parseInt(i.cartId.split("-")[1]),
          qty: i.qty,
          price_at_sale: i.price,
        })),
      };

      const res = await salesService.create(payload);

      if (paymentMethod === "1") setTotalCashReceived((prev) => prev + total);

      setLastTransaction({
        ...res.data.data,
        items: [...cart],
        total,
        paid: paidNumber,
        change,
        qrString: res.data.data.qr_string,
      });

      setShowSuccessModal(true);
      setCart([]);
      setCashAmount("");
      setOrderNumber((n) => n + 1);
    } catch (err) {
      setErrorMsg("Transaksi Gagal");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndShift = async (onLogout) => {
    try {
      const finalCash = startingCash + totalCashReceived;
      await shiftService.close({
        shift_id: currentShiftId,
        end_cash: finalCash,
      });
      localStorage.removeItem("active_shift_id");
      onLogout();
    } catch (err) {
      setErrorMsg("Gagal menutup shift");
    }
  };

  return {
    state: {
      products,
      categories,
      outlet,
      activeCat,
      searchQuery,
      cart,
      selectedProduct,
      paymentMethod,
      orderType,
      isProcessing,
      orderNumber,
      cashAmount,
      showSuccessModal,
      showEndShiftModal,
      errorMsg,
      lastTransaction,
      subtotal,
      tax,
      total,
      paidNumber,
      change,
      currentShiftId,
      filteredProducts: products.filter(
        (p) =>
          (activeCat === "ALL" || p.category_id === activeCat) &&
          p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    },
    actions: {
      setActiveCat,
      setSearchQuery,
      setSelectedProduct,
      setPaymentMethod,
      setOrderType,
      setCashAmount,
      setShowSuccessModal,
      setShowEndShiftModal,
      updateQty,
      addToCart,
      handleCheckout,
      handleEndShift,
    },
  };
}
