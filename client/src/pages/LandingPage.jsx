import {
    eyebrow,
    sectionTitle,
    highlight,
    cursorLabel,
    hoverLift,
    wrap,
    features,
    steps,
    useCases,
    marker,
    Logo,
} from "../components/landingPageData.jsx";
import { Link } from "react-router-dom";


const LandingPage = () => {

    return (
        <>
            <nav className="sticky top-0 z-100 flex h-16 items-center justify-between border-b border-line bg-bg px-6 md:px-12">
                <Logo />
                <div className="flex items-center gap-5">
                    <a href="/login" className="text-[15px] text-muted transition-colors hover:text-fg">
                        Sign in
                    </a>
                    <a
                        href="/register"
                        className="rounded-lg bg-fg px-5 py-2.25 text-[15px] font-medium text-white transition duration-150 hover:-translate-y-px hover:bg-[#333]"
                    >
                        Start drawing →
                    </a>
                </div>
            </nav>

            <main>
                <section className="mx-auto grid max-w-7xl animate-fade-up items-center gap-12 px-6 pt-12 pb-16 md:grid-cols-2 md:gap-16 md:px-20 md:pt-20 md:pb-25">
                    <div className="flex flex-col gap-6">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-line bg-card px-4 py-1.5 text-sm">
                            <span className="size-2 shrink-0 rounded-full bg-accent" />
                            A solo-built Tanix draw
                        </div>
                        <h1 className="font-serif text-[clamp(40px,5vw,64px)] leading-[1.1] font-bold tracking-[-1.5px]">
                            My take on the <em className={highlight}>whiteboard</em> you actually want.
                        </h1>
                        <p className="max-w-120 text-lg leading-[1.65] text-muted">
                            Tanix Draw is a hand-drawn virtual whiteboard I&apos;m building in the open. Infinite space,
                            real-time collab, zero setup — and yes, it&apos;s free forever.
                        </p>
                        <div className="flex flex-wrap gap-3.5">
                            <a
                                href="/register"
                                className="rounded-[10px] bg-fg px-7 py-3.5 font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-[#2d2d2d]"
                            >
                                Start drawing — it&apos;s free
                            </a>
                            <a
                                href="#how"
                                className="rounded-[10px] border-2 border-line px-7 py-3.5 font-medium transition duration-200 hover:-translate-y-0.5 hover:border-fg"
                            >
                                See how it works
                            </a>
                        </div>
                        <div className="flex items-center gap-3 text-[15px] text-muted">
                            <div className="flex">
                                {["#e8735a", "#5ba4e8", "#5bc97a", "#e8c45b"].map((c) => (
                                    <span
                                        key={c}
                                        className="-ml-1.5 block size-7 rounded-full border-2 border-bg first:ml-0"
                                        style={{ background: c }}
                                    />
                                ))}
                            </div>
                            <span>
                                <strong className="text-fg">Built solo</strong>, shipped in public
                            </span>
                        </div>
                    </div>

                    <div className="relative flex justify-center">
                        <div className="pointer-events-none absolute -top-8 left-1/2 z-0 translate-x-[10%] animate-peek font-serif text-lg whitespace-nowrap text-accent italic motion-reduce:animate-none">
                            ← yes, really free
                        </div>

                        <div className="relative z-10 w-full max-w-120 animate-float-canvas overflow-hidden rounded-2xl border-2 border-fg bg-white shadow-[8px_8px_0_var(--color-fg)]">
                            <div className="flex items-center gap-1.5 border-b-[1.5px] border-[#e8e4dc] bg-card px-4 py-3">
                                <span className="size-3 rounded-full bg-[#ff5f57]" />
                                <span className="size-3 rounded-full bg-[#ffbd2e]" />
                                <span className="size-3 rounded-full bg-[#28ca41]" />
                                <div className="ml-4 flex gap-4 text-sm text-muted">
                                    <span>▭</span><span>○</span><span>◇</span><span>—</span><span>✏</span><span>T</span>
                                </div>
                            </div>

                            <div className="relative min-h-65 bg-white p-4">
                                <div className="absolute top-4.5 left-3.5">
                                    <span className={cursorLabel} style={{ background: "#4a9be8" }}>Just</span>
                                </div>
                                <svg className="h-auto w-full" viewBox="0 0 320 200">
                                    <rect x="20" y="60" width="100" height="54" rx="4" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                                    <text x="70" y="92" textAnchor="middle" fontSize="16" fontFamily="Georgia, serif">Idea</text>
                                    <path d="M120 87 Q175 60 210 80" fill="none" stroke="#e8735a" strokeWidth="2" markerEnd="url(#ar)" />
                                    <ellipse cx="245" cy="84" rx="58" ry="32" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                                    <text x="245" y="90" textAnchor="middle" fontSize="16" fontFamily="Georgia, serif">Sketch</text>
                                    <path d="M70 114 Q110 158 175 156" fill="none" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#ad)" />
                                    <path d="M215 108 Q200 148 215 153" fill="none" stroke="#1a1a1a" strokeWidth="2" markerEnd="url(#ad)" />
                                    <polygon points="235,128 270,153 235,178 200,153" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                                    <text x="235" y="158" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif">Ship it</text>
                                    <defs>
                                        <marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                            <path d="M0,0 L0,6 L8,3 z" fill="#e8735a" />
                                        </marker>
                                        <marker id="ad" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                            <path d="M0,0 L0,6 L8,3 z" fill="#1a1a1a" />
                                        </marker>
                                    </defs>
                                </svg>
                                <div className="absolute bottom-4 left-4 flex animate-float items-center gap-2 rounded border-[1.5px] border-[#d4b84a] bg-[#f5d76b] px-4 py-3 font-serif text-sm italic shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                                    <span>infinite space</span>
                                    <span>✦</span>
                                </div>
                                <div className="absolute right-4 bottom-7">
                                    <span className={cursorLabel} style={{ background: "#e8735a" }}>Draw</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={wrap}>
                    <p className={eyebrow}>— what&apos;s inside</p>
                    <h2 className={sectionTitle}>
                        Everything you need. <em className="text-[#8a8070]">Nothing you don&apos;t.</em>
                    </h2>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <div key={f.title} className={`rounded-2xl border-2 border-fg bg-card px-7 py-8 ${hoverLift}`}>
                                <div
                                    className="mb-5 grid size-14 place-items-center rounded-xl border-[1.5px] border-black/10 text-[22px]"
                                    style={{ background: f.bg }}
                                >
                                    {f.icon}
                                </div>
                                <h3 className="mb-2.5 font-serif text-[22px] font-bold tracking-[-0.3px]">{f.title}</h3>
                                <p className="text-[15px] text-muted">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="how" className={`${wrap} border-t border-line`}>
                    <div className="mb-12 flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className={eyebrow}>— how it works</p>
                            <h2 className={`${sectionTitle} mb-0!`}>
                                From blank page to <span className={highlight}>brilliant</span> in minutes.
                            </h2>
                        </div>
                        <p className="max-w-55 shrink-0 text-left text-[15px] text-muted md:text-right">
                            seriously — the first sketch is
                            <br />
                            the hardest, then it flows.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                        {steps.map((s) => (
                            <div
                                key={s.num}
                                className="relative rounded-[14px] border-2 border-fg bg-card px-6 py-7 transition duration-200 hover:z-10 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-fg)] lg:not-last:-mr-0.5"
                            >
                                <div className="mb-8 font-serif text-[32px] font-bold tracking-[-1px] text-accent">{s.num}</div>
                                <h3 className="mb-2.5 font-serif text-xl leading-[1.2] font-bold">{s.title}</h3>
                                <p className="text-[15px] text-muted">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={`${wrap} border-t border-line`}>
                    <p className={eyebrow}>— what people draw</p>
                    <h2 className={sectionTitle}>One board, every kind of thinking.</h2>
                    <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {useCases.map((c, i) => (
                            <div
                                key={c.label}
                                className="animate-float-canvas overflow-hidden rounded-2xl border-2 border-fg transition duration-200 hover:-translate-y-1.5 hover:shadow-[6px_6px_0_var(--color-fg)]"
                                style={{ background: c.bg, animationDelay: `${i * 0.8}s` }}
                            >
                                <div className="m-3 flex min-h-40 items-center justify-center overflow-hidden rounded-[10px] border-[1.5px] border-fg bg-white [&_svg]:h-auto [&_svg]:w-full">
                                    {c.svg}
                                </div>
                                <div className="flex items-center justify-between px-4 py-3.5">
                                    <span className="font-serif text-base font-semibold">{c.label}</span>
                                    <span className="text-[11px] font-bold tracking-[0.08em] text-muted">{c.tag}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <blockquote className="pt-6 text-center">
                        <p className="mb-4 font-serif text-[clamp(20px,2.5vw,30px)] leading-normal italic">
                            &ldquo;It feels like a real whiteboard, but with{" "}
                            <span className="underline decoration-accent decoration-2 underline-offset-4">undo</span>.
                            <br />
                            I can&apos;t go back.&rdquo;
                        </p>
                        <cite className="text-[15px] text-muted not-italic">— Sana R., staff designer</cite>
                    </blockquote>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="flex flex-col items-start justify-between gap-6 border-t border-line px-6 py-8 md:flex-row md:items-center md:px-20">
                <div className="flex flex-wrap items-center gap-5">
                    <Logo />
                    <span className="text-sm text-muted">© 2026 — a solo project, built by Tanishq Kushwah</span>
                </div>
                <nav aria-label="Footer" className="flex gap-6">
                    <Link
                        to="/privacy"
                        state={{ fromRegister: true }}
                        className="text-sm text-muted transition-colors hover:text-fg"
                    >
                        Privacy
                    </Link>
                    <Link
                        to="/terms"
                        state={{ fromRegister: true }}
                        className="text-sm text-muted transition-colors hover:text-fg"
                    >
                        Terms
                    </Link>
                    <a
                        href="https://www.linkedin.com/in/tanishq-kushwah/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted transition-colors hover:text-fg"
                    >
                        Contact
                    </a>
                </nav>
            </footer>
        </>
    );
}

export default LandingPage;