import { useState, useEffect } from "preact/hooks";
import { productService } from "../services/productService";

export default function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Untuk Modal Varian

  useEffect(() => {
    productService.getAll().then((res) => {
      // Sesuai JSON kamu, data ada di res.data.data
      setProducts(res.data.data || []);
    });
  }, []);

  const addToCart = (product, variant) => {
    const cartId = `${product.id}-${variant.id}`;
    const exist = cart.find((item) => item.cartId === cartId);

    if (exist) {
      setCart(
        cart.map((item) =>
          item.cartId === cartId ? { ...exist, qty: exist.qty + 1 } : item
        )
      );
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
    setSelectedProduct(null); // Tutup modal setelah pilih
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  return (
    <div className="flex h-screen bg-[#F8F5F2] text-[#2C2420] font-['Plus_Jakarta_Sans'] overflow-hidden">
      {/* --- KIRI: MENU GRID --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-8 flex justify-between items-center bg-transparent">
          <div>
            <h1 className="text-4xl font-['Playfair_Display'] font-bold text-[#1F1916]">
              The Artisan Brew
            </h1>
            <p className="text-stone-500 font-medium">
              Authentic Coffee Experience • {user?.username}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="p-3 bg-white border border-stone-200 rounded-2xl hover:bg-red-50 hover:border-red-100 group transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              className="text-stone-400 group-hover:text-red-500"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EFE9E4] rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-[#4A3728] transition-colors duration-500"></div>

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4">
                    {p.category_name}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-stone-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {p.description ||
                      "Crafted with passion and the finest beans."}
                  </p>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase">
                        Starts from
                      </p>
                      <p className="text-lg font-black text-[#4A3728]">
                        Rp {p.variants[0]?.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-stone-900 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- KANAN: CHECKOUT PANEL --- */}
      <div className="w-[420px] bg-white border-l border-stone-100 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
        <div className="p-8">
          <h2 className="text-2xl font-bold font-['Playfair_Display'] flex items-center gap-3">
            Your Order
            <span className="bg-[#4A3728] text-white text-[10px] px-3 py-1 rounded-full font-sans">
              {cart.length}
            </span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-8 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-300 opacity-60">
              <div className="w-20 h-20 mb-4 bg-stone-50 rounded-full flex items-center justify-center">
                ☕
              </div>
              <p className="text-sm font-medium italic">Your cup is empty...</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
                className="flex gap-4 group animate-in slide-in-from-bottom-2"
              >
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-xl shrink-0">
                  ☕
                </div>
                <div className="flex-1 border-b border-stone-50 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-stone-800">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400 font-medium uppercase tracking-tighter">
                      {item.variantName} • x{item.qty}
                    </span>
                    <span className="font-bold text-stone-700 font-mono italic">
                      Rp {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-[#FAF9F7] rounded-t-[3rem]">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Service & Tax</span>
              <span className="font-bold">
                Rp {(total * 0.1).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-['Playfair_Display'] font-bold">
                Total Amount
              </span>
              <span className="text-2xl font-black text-[#4A3728]">
                Rp {(total * 1.1).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            disabled={cart.length === 0}
            className="w-full bg-[#1F1916] hover:bg-[#3C2C20] disabled:bg-stone-200 text-white py-5 rounded-[2rem] font-bold text-sm tracking-[0.1em] uppercase shadow-xl transition-all active:scale-[0.98]"
          >
            Finalize Transaction
          </button>
        </div>
      </div>

      {/* --- MODAL: PILIH VARIAN --- */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-8 right-8 text-stone-400 hover:text-stone-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-400">
              {selectedProduct.category_name}
            </span>
            <h2 className="text-3xl font-['Playfair_Display'] font-bold mt-2 mb-8">
              {selectedProduct.name}
            </h2>

            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
              Select Variant
            </p>
            <div className="space-y-3">
              {selectedProduct.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => addToCart(selectedProduct, v)}
                  className="w-full p-5 bg-stone-50 hover:bg-[#4A3728] hover:text-white rounded-3xl border border-stone-100 flex justify-between items-center transition-all font-bold text-left group"
                >
                  <span className="text-sm uppercase tracking-tight">
                    {v.variant_name}
                  </span>
                  <span className="font-mono text-stone-400 group-hover:text-white/80">
                    Rp {v.price.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
