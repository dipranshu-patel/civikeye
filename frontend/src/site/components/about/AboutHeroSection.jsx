export default function AboutHeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-transparent pt-24 pb-20">
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <h1 className="font-[var(--font-satoshi)] text-5xl md:text-6xl lg:text-[72px] font-bold text-center tracking-tight leading-[1.05]">
                    <span className="block text-stone-800">
                        Public problems
                    </span>
                    <span className="block text-stone-400 mt-1">
                        deserve public visibility.
                    </span>
                </h1>

                <p className="font-[var(--font-inter)] mt-7 text-base md:text-[18px] text-stone-500 max-w-[600px] text-center leading-relaxed">
                    CivikEye exists because civic systems fail when
                    accountability disappears. We are building the public ledger
                    for city issues - visible, verifiable, and time-bound by
                    design.
                </p>
            </div>
        </section>
    );
}
