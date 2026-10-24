export const primaryButton =
    "bg-brand-yellow text-[#080D1A] font-bold px-8 py-3 rounded-xl hover:brightness-110 transition";

export const ghostButton =
    "border border-white/15 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-sm hover:border-brand-yellow/40 transition";

export const choiceClass = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-bold border transition-colors duration-200 ${
        active
            ? "bg-brand-yellow text-[#080D1A] border-brand-yellow"
            : "bg-slate-900/50 text-slate-300 border-white/10 hover:border-brand-yellow/40"
    }`;
