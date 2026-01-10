import { Sidebar } from "../components/fragments/Sidebar";
import { Header } from "../components/fragments/Header";

export function AdminLayout({ children, title = "Dashboard" }) {
  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="p-8 animate-in fade-in duration-700">{children}</main>
      </div>
    </div>
  );
}
