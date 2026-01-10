import { Plus } from "lucide-preact";

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  buttonLabel,
  onButtonClick,
  badge,
}) {
  return (
    <div className="flex justify-between items-end mb-8">
      <div className="flex items-center gap-6">
        {Icon && (
          <div className="w-16 h-16 bg-coffee-800 rounded-[28px] flex items-center justify-center text-white shadow-lg shadow-coffee-900/20">
            <Icon size={28} />
          </div>
        )}
        <div>
          <h1 className="text-4xl font-black text-stone-900 uppercase tracking-tighter leading-none italic">
            {title} {badge && <span className="text-coffee-800">{badge}</span>}
          </h1>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mt-3">
            {subtitle}
          </p>
        </div>
      </div>

      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 px-8 py-4 bg-coffee-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-coffee-950 transition-all shadow-xl shadow-coffee-900/20 active:scale-95"
        >
          <Plus size={18} /> {buttonLabel}
        </button>
      )}
    </div>
  );
}
