"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface Section {
    id: string;
    label: string;
    bgImage: string;
    content: React.ReactNode;
}

interface FullScreenPortfolioProps {
    sections: Section[];
}

const socialLinks = [
    {
        name: "GitHub",
        icon: "/images/icon/github.svg",
        url: "https://github.com/Jang4360",
        type: "link" as const,
    },
    {
        name: "Tistory",
        icon: "/images/icon/tistory.svg",
        url: "https://yoon4360.tistory.com/",
        type: "link" as const,
    },
    {
        name: "Gmail",
        icon: "/images/icon/gmail.svg",
        url: "jooyoon4360@gmail.com",
        type: "clipboard" as const,
    },
];

export default function FullScreenPortfolio({ sections }: FullScreenPortfolioProps) {
    const total = sections.length;
    const [activeIndex, setActiveIndex] = useState(0);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleSocialClick = (item: typeof socialLinks[0]) => {
        if (item.type === "clipboard") {
            navigator.clipboard.writeText(item.url).then(() => {
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
            });
        } else {
            window.open(item.url, "_blank", "noopener,noreferrer");
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const bgRefs = useRef<HTMLDivElement[]>([]);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const isAnimatingRef = useRef(false);
    const lastIndexRef = useRef(0);

    const goTo = useCallback((index: number) => {
        const clamped = Math.max(0, Math.min(total - 1, index));
        if (clamped === lastIndexRef.current || isAnimatingRef.current) return;

        isAnimatingRef.current = true;
        const from = lastIndexRef.current;

        // Background crossfade
        const prevBg = bgRefs.current[from];
        const newBg = bgRefs.current[clamped];

        if (newBg) {
            gsap.set(newBg, { opacity: 0 });
            gsap.to(newBg, { opacity: 1, duration: 0.8, ease: "power2.out" });
        }
        if (prevBg) {
            gsap.to(prevBg, { opacity: 0, duration: 0.8, ease: "power2.out" });
        }

        // Progress bar
        if (progressFillRef.current) {
            const p = (clamped / (total - 1)) * 100;
            gsap.to(progressFillRef.current, { width: `${p}%`, duration: 0.5, ease: "power2.out" });
        }

        setActiveIndex(clamped);
        lastIndexRef.current = clamped;

        gsap.delayedCall(0.8, () => {
            isAnimatingRef.current = false;
        });
    }, [total]);

    // GSAP ScrollTrigger setup
    useEffect(() => {
        if (typeof window === "undefined") return;
        const container = containerRef.current;
        const wrapper = wrapperRef.current;
        if (!container || !wrapper || total === 0) return;

        // Set initial background
        bgRefs.current.forEach((bg, i) => {
            if (bg) gsap.set(bg, { opacity: i === 0 ? 1 : 0 });
        });

        const st = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            pin: wrapper,
            pinSpacing: false,
            onUpdate: (self) => {
                const progress = self.progress;
                const targetIndex = Math.min(total - 1, Math.floor(progress * total));

                if (targetIndex !== lastIndexRef.current && !isAnimatingRef.current) {
                    goTo(targetIndex);
                }
            },
        });

        return () => {
            st.kill();
        };
    }, [total, goTo]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                goTo(lastIndexRef.current + 1);
            } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                goTo(lastIndexRef.current - 1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goTo]);

    const handleLabelClick = (index: number) => {
        const container = containerRef.current;
        if (!container) return;
        const sectionHeight = container.scrollHeight / total;
        window.scrollTo({ top: sectionHeight * index, behavior: "smooth" });
    };

    return (
        <div
            ref={containerRef}
            className="relative"
            style={{ height: `${(total + 1) * 100}vh` }}
        >
            <div
                ref={wrapperRef}
                className="relative w-full h-screen overflow-hidden"
            >
                {/* Backgrounds */}
                <div className="absolute inset-0 z-0">
                    {sections.map((section, i) => (
                        <div
                            key={section.id}
                            ref={(el) => { if (el) bgRefs.current[i] = el; }}
                            className="absolute inset-0"
                            style={{ opacity: i === 0 ? 1 : 0 }}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url('${section.bgImage}')`,
                                    // Modified brightness here: 0.15 -> 0.4
                                    filter: "brightness(0.4) blur(1px)",
                                }}
                            />
                            {/* Modified gradient opacity: from-black/70 -> from-black/50, via-black/50 -> via-black/20, to-black/80 -> to-black/60 */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-sm font-extrabold text-white/70 uppercase"
                        style={{ letterSpacing: "0.2em" }}
                    >
                        Jang Jooyoon
                    </motion.h1>

                    {/* Social Icons */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex items-center gap-3"
                    >
                        {socialLinks.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleSocialClick(item)}
                                className="relative group cursor-pointer"
                                title={item.type === "clipboard" ? `Copy: ${item.url}` : item.name}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-8 h-8 transition-transform duration-300 ease-out group-hover:scale-125"
                                    style={{ filter: "brightness(0) invert(1)", opacity: 0.7 }}
                                />
                                {item.type === "clipboard" && copiedEmail && (
                                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-white/10 backdrop-blur-md text-white px-2 py-0.5 rounded">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                </header>

                {/* Right Side Labels */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3 items-end">
                    {sections.map((section, i) => (
                        <button
                            key={`right-${section.id}`}
                            onClick={() => handleLabelClick(i)}
                            className={`flex items-center gap-2.5 text-xs font-extrabold uppercase transition-all duration-500 cursor-pointer ${i === activeIndex
                                ? "text-white -translate-x-1"
                                : "text-white/25 hover:text-white/40"
                                }`}
                            style={{ letterSpacing: "0.15em" }}
                        >
                            {section.label}
                            {i === activeIndex && (
                                <span className="text-white text-[10px]">&bull;</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Center Content */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full max-w-6xl mx-auto"
                        >
                            {sections[activeIndex]?.content}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    <span className="text-[10px] font-bold text-white/50 tabular-nums" style={{ letterSpacing: "0.1em" }}>
                        {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                    <div className="w-32 h-[1px] bg-white/15 relative overflow-hidden">
                        <div
                            ref={progressFillRef}
                            className="absolute inset-y-0 left-0 bg-white/60"
                            style={{ width: "0%" }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-white/30 tabular-nums" style={{ letterSpacing: "0.1em" }}>
                        {String(total).padStart(2, "0")}
                    </span>
                </div>

                {/* Mobile Navigation */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex md:hidden gap-2">
                    {sections.map((_, i) => (
                        <button
                            key={`dot-${i}`}
                            onClick={() => handleLabelClick(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-white w-6" : "bg-white/30"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
