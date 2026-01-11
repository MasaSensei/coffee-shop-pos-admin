import { createContext } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Ambil dari localStorage agar saat refresh halaman, pilihan outlet tidak hilang
  const [activeOutletId, setActiveOutletId] = useState(
    localStorage.getItem("active_outlet_id") || "1"
  );

  const changeOutlet = (id) => {
    setActiveOutletId(id);
    localStorage.setItem("active_outlet_id", id);
  };

  return (
    <AppContext.Provider value={{ activeOutletId, changeOutlet }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
