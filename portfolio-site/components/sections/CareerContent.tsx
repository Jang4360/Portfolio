"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CareerItem {
    id: string;
    title: string;
    category: string;
    date: string;
    organization: string;
    description: string;
}

interface CareerGroup {
    Education: CareerItem[];
    Certificate: CareerItem[];
    Award: CareerItem[];
}

interface CareerContentProps {
    career: CareerGroup;
    isActive: boolean;
}

export default function CareerContent({ career, isActive }: CareerContentProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const allItems = [
        ...career.Education.map((item) => ({ ...item, categoryLabel: "Education" })),
        ...career.Certificate.map((item) => ({ ...item, categoryLabel: "Certificate" })),
        ...career.Award.map((item) => ({ ...item, categoryLabel: "Award" })),
    ];

    // Prevent main scroll when inner content has room to scroll
    useEffect(() => {
        if (!isActive) return;
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const atTop = scrollTop <= 0 && e.deltaY < 0;
            const atBottom =
                scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;

            if (!atTop && !atBottom) {
                e.stopPropagation();
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [isActive]);

    // Track scroll progress for line animation
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const maxScroll = scrollHeight - clientHeight;
            if (maxScroll > 0) {
                setScrollProgress(scrollTop / maxScroll);
            }
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    if (allItems.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-white/50 text-lg">No career data yet.</p>
            </div>
        );
    }

    const categoryColors: Record<string, string> = {
        Education: "bg-white/[0.06] border-white/[0.1] text-white/60",
        Certificate: "bg-white/[0.06] border-white/[0.1] text-white/60",
        Award: "bg-white/[0.06] border-white/[0.1] text-white/60",
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>Career</h3>
                <div className="w-10 h-[1px] bg-white/20 mx-auto mt-4" />
            </div>

            {/* Scrollable Timeline */}
            <div
                ref={scrollRef}
                className="career-scroll relative max-h-[60vh] overflow-y-auto pr-2"
            >
                <div className="relative pl-8 md:pl-12">
                    {/* Vertical line */}
                    <div className="absolute left-3 md:left-5 top-0 bottom-0 w-[1px] bg-white/[0.08]">
                        <motion.div
                            className="w-full bg-gradient-to-b from-white/40 via-white/20 to-transparent"
                            style={{ height: `${scrollProgress * 100}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    {/* Items */}
                    {allItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isActive ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative pb-8 last:pb-0"
                        >
                            {/* Dot */}
                            <div className="absolute left-[-21px] md:left-[-27px] top-1 w-3 h-3 rounded-full bg-black border border-white/20 z-10" />

                            {/* Card */}
                            <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full border ${
                                            categoryColors[item.categoryLabel] || "bg-gray-500/20 border-gray-400/30 text-gray-300"
                                        }`}
                                    >
                                        {item.categoryLabel}
                                    </span>
                                    {item.date && (
                                        <span className="text-xs text-white/30">
                                            {item.date}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">
                                    {item.title}
                                </h4>
                                {item.organization && (
                                    <p className="text-white/40 text-sm mb-1">
                                        {item.organization}
                                    </p>
                                )}
                                {item.description && (
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
