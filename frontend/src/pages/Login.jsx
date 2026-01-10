import { useLogin } from "../hooks/useLogin";
import { DynamicForm } from "../components/shared/DynamicForm";
import { Coffee, Quote } from "lucide-preact";

export function Login() {
  const { register, handleSubmit, errors, loginFields, isLoading } = useLogin();

  return (
    <div className="min-h-screen w-full flex bg-stone-50 font-sans">
      {/* SISI KIRI: Visual Experience (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-coffee-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Background Image dengan Overlay Brownish */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070')] bg-cover bg-center" />
        {/* Gradient Overlay untuk depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-900 via-transparent to-coffee-900/50" />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl">
              <Coffee className="text-amber-100" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tighter font-serif italic">
              BrewFlow
            </h1>
          </div>

          <div className="space-y-6">
            <Quote className="text-amber-200/50" size={48} />
            <h2 className="text-5xl font-serif text-white leading-tight italic">
              "Great coffee is built on precision and passion."
            </h2>
            <p className="text-stone-300 text-xl font-light leading-relaxed">
              Pantau stok, kelola outlet, dan tingkatkan penjualan dalam satu
              dashboard yang hangat sehangat kopi pagi.
            </p>
          </div>

          <div className="mt-20 flex gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-coffee-900 bg-stone-300 overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                    alt="user"
                  />
                </div>
              ))}
            </div>
            <p className="text-stone-400 text-sm self-center">
              Bergabung dengan{" "}
              <span className="text-white font-semibold">500+ Barista</span> di
              seluruh Indonesia.
            </p>
          </div>
        </div>
      </div>

      {/* SISI KANAN: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:rounded-l-[40px] shadow-[-20px_0_50px_rgba(0,0,0,0.05)] z-20">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex justify-center mb-6">
              <Coffee className="text-coffee-800" size={48} />
            </div>
            <h3 className="text-4xl font-black text-stone-900 tracking-tight">
              Selamat Datang
            </h3>
            <p className="text-stone-500 text-lg font-medium">
              Silakan masuk untuk mengelola kedaimu.
            </p>
          </div>

          <div className="bg-stone-50/50 p-8 rounded-3xl border border-stone-100 shadow-inner">
            <DynamicForm
              fields={loginFields}
              buttonLabel="Mulai Kelola Sekarang"
              register={register}
              errors={errors}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          <footer className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-12 bg-stone-200"></span>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-widest font-sans">
                KopiSensei Tech
              </span>
              <span className="h-px w-12 bg-stone-200"></span>
            </div>
            <p className="text-sm text-stone-400">
              Butuh bantuan akses?{" "}
              <a href="#" className="text-coffee-700 font-bold hover:underline">
                Hubungi Support
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
