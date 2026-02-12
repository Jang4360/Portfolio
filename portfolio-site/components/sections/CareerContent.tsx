"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
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
    Language: CareerItem[];
}

interface CareerContentProps {
    career: CareerGroup;
    isActive: boolean;
}

/** Extract the grouping year from a date string. */
function extractYear(date: string): number {
    if (!date) return 0;
    const trimmed = date.trim();

    if (trimmed.includes("-")) {
        const parts = trimmed.split("-").map((s) => s.trim());
        const endPart = parts[parts.length - 1];
        if (endPart.toLowerCase() === "now") {
            return new Date().getFullYear();
        }
        const match = endPart.match(/(\d{4})/);
        if (match) return parseInt(match[1], 10);
    }

    const match = trimmed.match(/(\d{4})/);
    if (match) return parseInt(match[1], 10);

    return 0;
}

/** Extract a sortable end-date value for ordering within a year group.
 *  Higher = more recent. "Now" → Infinity.
 *  Returns yyyy*100 + mm for comparison. */
function extractEndDateSort(date: string): number {
    if (!date) return 0;
    const trimmed = date.trim();

    if (trimmed.includes("-")) {
        const parts = trimmed.split("-").map((s) => s.trim());
        const endPart = parts[parts.length - 1];
        if (endPart.toLowerCase() === "now") return Infinity;
        const match = endPart.match(/(\d{4})\.(\d{1,2})/);
        if (match) return parseInt(match[1], 10) * 100 + parseInt(match[2], 10);
        const yearOnly = endPart.match(/(\d{4})/);
        if (yearOnly) return parseInt(yearOnly[1], 10) * 100;
    }

    const match = trimmed.match(/(\d{4})\.(\d{1,2})/);
    if (match) return parseInt(match[1], 10) * 100 + parseInt(match[2], 10);

    return 0;
}

const categoryColors: Record<string, { badge: string; dot: string }> = {
    Award: {
        badge: "bg-yellow-500/20 border-yellow-400/40 text-yellow-300",
        dot: "bg-yellow-400",
    },
    Education: {
        badge: "bg-green-500/20 border-green-400/40 text-green-300",
        dot: "bg-green-400",
    },
    Certificate: {
        badge: "bg-blue-500/20 border-blue-400/40 text-blue-300",
        dot: "bg-blue-400",
    },
    Language: {
        badge: "bg-white/[0.08] border-white/[0.15] text-white/60",
        dot: "bg-white/50",
    },
};

const defaultColor = {
    badge: "bg-white/[0.06] border-white/[0.1] text-white/60",
    dot: "bg-white/40",
};

const TIMELINE_LEFT = 100;

export default function CareerContent({ career, isActive }: CareerContentProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const allItems = useMemo(() => [
        ...career.Education.map((item) => ({ ...item, categoryLabel: "Education" })),
        ...career.Certificate.map((item) => ({ ...item, categoryLabel: "Certificate" })),
        ...career.Award.map((item) => ({ ...item, categoryLabel: "Award" })),
        ...career.Language.map((item) => ({ ...item, categoryLabel: "Language" })),
    ], [career]);

    // Group items by year, sorted descending. Within each year, sort by end date descending.
    const yearGroups = useMemo(() => {
        const groups: Record<number, (CareerItem & { categoryLabel: string })[]> = {};
        for (const item of allItems) {
            const year = extractYear(item.date);
            if (!groups[year]) groups[year] = [];
            groups[year].push(item);
        }
        const sortedYears = Object.keys(groups)
            .map(Number)
            .sort((a, b) => b - a);
        return sortedYears.map((year) => ({
            year,
            items: groups[year].sort(
                (a, b) => extractEndDateSort(b.date) - extractEndDateSort(a.date)
            ),
        }));
    }, [allItems]);

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

    let globalIndex = 0;

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <h3
                    className="text-4xl md:text-5xl font-extrabold text-white"
                    style={{ letterSpacing: "-0.02em" }}
                >
                    Career
                </h3>
                <div className="w-10 h-[1px] bg-white/20 mx-auto mt-4" />
            </div>

            {/* Scrollable Timeline */}
            <div
                ref={scrollRef}
                className="career-scroll relative max-h-[60vh] overflow-y-auto"
            >
                <div className="relative" style={{ paddingLeft: `${TIMELINE_LEFT + 24}px` }}>
                    {/* Vertical timeline line */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-white/[0.08]"
                        style={{ left: `${TIMELINE_LEFT}px` }}
                    >
                        <motion.div
                            className="w-full bg-gradient-to-b from-blue-400/60 via-blue-400/20 to-transparent"
                            style={{ height: `${scrollProgress * 100}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    {/* Year groups */}
                    {yearGroups.map((group) => (
                        <div key={group.year} className="relative mb-8 last:mb-0">
                            {/* Year label - positioned left of timeline */}
                            <div
                                className="absolute top-1 flex items-center"
                                style={{ left: `-${TIMELINE_LEFT + 24}px`, width: `${TIMELINE_LEFT}px` }}
                            >
                                <div className="w-full text-right pr-5">
                                    <span className="text-3xl md:text-4xl font-extrabold text-white/70 tabular-nums">
                                        {group.year || "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Cards for this year */}
                            <div className="flex flex-col gap-3">
                                {group.items.map((item) => {
                                    const idx = globalIndex++;
                                    const colors = categoryColors[item.categoryLabel] || defaultColor;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={isActive ? { opacity: 1, x: 0 } : {}}
                                            transition={{ duration: 0.4, delay: idx * 0.07 }}
                                            className="relative"
                                        >
                                            {/* Dot on timeline */}
                                            <div
                                                className="absolute z-10"
                                                style={{
                                                    left: `-${24 + 5}px`,
                                                    top: "16px",
                                                }}
                                            >
                                                <div className={`w-[10px] h-[10px] rounded-full ${colors.dot} border-2 border-black`} />
                                            </div>

                                            {/* Card */}
                                            <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/[0.06] hover:bg-white/[0.06] transition-colors duration-300">
                                                {/* Date on top */}
                                                {item.date && (
                                                    <p className="text-xs text-white/35 mb-2 font-medium">
                                                        {item.date}
                                                    </p>
                                                )}

                                                {/* Category badge */}
                                                <div className="mb-2">
                                                    <span
                                                        className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${colors.badge}`}
                                                    >
                                                        {item.categoryLabel}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h4 className="text-[15px] font-bold text-white mb-1">
                                                    {item.title}
                                                </h4>

                                                {/* Organization */}
                                                {item.organization && (
                                                    <p className="text-white/40 text-sm">
                                                        {item.organization}
                                                    </p>
                                                )}

                                                {/* Description */}
                                                {item.description && (
                                                    <p className="text-white text-sm leading-relaxed mt-1">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
