import { useState, useEffect } from "preact/hooks";
import { productService } from "../services/productService";
import { categoryService } from "../services/category.service";
import { salesService } from "../services/sales.service";
import { outletService } from "../services/outlet.service";

export function useDashboard(user) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [outlet, setOutlet] = useState(null);
  const [activeCat, setActiveCat] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State Transaksi & UI
  const [paymentMethod, setPaymentMethod] = useState("1"); // 1: Tunai, 2: QRIS
  const [orderType, setOrderType] = useState("Dine-in");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState(1);
  const [cashAmount, setCashAmount] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    if (!user?.outlet_id) return;
    Promise.all([
      categoryService.getAll(),
      productService.getAll(),
      outletService.getByID(user.outlet_id),
    ])
      .then(([catRes, prodRes, outletRes]) => {
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
        const outData = outletRes.data.data;
        setOutlet({
          name: outData.name,
          address: outData.address,
          phone: outData.phone?.String || outData.phone || "-",
          slogan: outData.slogan || "Life Happens, Coffee Helps",
        });
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setErrorMsg("Gagal memuat data dari server");
      });
  }, [user?.outlet_id]);

  // Logic Perhitungan
  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // PERBAIKAN: Jika bukan tunai, otomatis paidNumber dianggap LUNAS (total)
  const paidNumber =
    paymentMethod === "1" ? parseFloat(cashAmount) || 0 : total;
  const change = paymentMethod === "1" ? Math.max(0, paidNumber - total) : 0;

  // Auto-fill cashAmount jika QRIS/Debit agar UI tidak error "pembayaran kurang"
  useEffect(() => {
    if (paymentMethod !== "1") {
      setCashAmount(total.toFixed(0));
    } else {
      setCashAmount("");
    }
  }, [paymentMethod, total]);

  const currentShiftId = parseInt(
    localStorage.getItem("active_shift_id") || "1",
  );

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCat === "ALL" || p.category_id === activeCat;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const updateQty = (cartId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item,
      ),
    );
  };

  const addToCart = (product, variant) => {
    const cartId = `${product.id}-${variant.id}`;
    const exist = cart.find((item) => item.cartId === cartId);
    if (exist) {
      updateQty(cartId, 1);
    } else {
      setCart([
        ...cart,
        {
          cartId,
          id: product.id,
          name: product.name,
          variantName: variant.variant_name,
          price: variant.price,
          qty: 1,
        },
      ]);
    }
    setSelectedProduct(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Validasi hanya untuk Tunai
    if (paymentMethod === "1" && paidNumber < total) {
      setErrorMsg(`Uang kurang Rp ${(total - paidNumber).toLocaleString()}`);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        shift_id: currentShiftId,
        user_id: user.id,
        payment_method_id: parseInt(paymentMethod),
        order_source: "POS_CASHIER",
        order_type: orderType,
        amount_paid: paidNumber,
        items: cart.map((item) => ({
          menu_variant_id: parseInt(item.cartId.split("-")[1]),
          qty: item.qty,
          price_at_sale: item.price,
        })),
      };

      const res = await salesService.create(payload);
      const serverData = res.data.data;

      console.log("Data dari Server:", serverData);

      setLastTransaction({
        orderNo: String(orderNumber).padStart(3, "0"),
        total,
        subtotal,
        tax,
        paid: paidNumber,
        change,
        items: [...cart],
        date: new Date().toLocaleString("id-ID"),
        // Tambahan data dari Backend Xendit
        qrString: serverData.qr_string,
        paymentStatus: serverData.status || "PAID",
      });

      setShowSuccessModal(true);
      setCart([]);
      setCashAmount("");
      setOrderNumber((prev) => prev + 1);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Gagal memproses transaksi");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    state: {
      categories,
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
      errorMsg,
      lastTransaction,
      filteredProducts,
      subtotal,
      tax,
      total,
      paidNumber,
      change,
      currentShiftId,
      outlet,
    },
    actions: {
      setActiveCat,
      setSearchQuery,
      setSelectedProduct,
      setPaymentMethod,
      setOrderType,
      setCashAmount,
      setShowSuccessModal,
      updateQty,
      addToCart,
      handleCheckout,
    },
  };
}
