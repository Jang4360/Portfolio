"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
    id: string;
    name: string;
    level: number;
    detail: string;
    iconUrl: string;
    category: string;
}

interface SkillsContentProps {
    skills: Skill[];
}

const CATEGORIES = ["All", "Backend", "DevOps", "DATABASE", "Frontend", "Collaboration"];

function LevelStars({ level }: { level: number }) {
    return (
        <span className="text-yellow-400 text-sm">
            {"★".repeat(level)}
            {"☆".repeat(Math.max(0, 5 - level))}
        </span>
    );
}

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
    },
};

function GlassFilter() {
    return (
        <svg className="glass-filter-svg">
            <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
                <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
                <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
                <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
                    <fePointLight x="-200" y="-200" z="300" />
                </feSpecularLighting>
                <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
                <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </svg>
    );
}

function SkillCard({
    skill,
    onSelect,
}: {
    skill: Skill;
    onSelect: (skill: Skill, rect: DOMRect) => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            onSelect(skill, rect);
        }
    };

    return (
        <motion.div
            ref={cardRef}
            variants={cardVariants}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="relative flex flex-col items-center justify-center aspect-square rounded-2xl cursor-pointer overflow-hidden transition-all duration-700"
            style={{
                boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
                transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
            }}
        >
            {/* Glass layers */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-xl" style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }} />
            <div className="absolute inset-0 z-10 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.03)" }} />
            <div className="absolute inset-0 z-20 rounded-xl overflow-hidden" style={{ boxShadow: "inset 1px 1px 1px 0 rgba(255, 255, 255, 0.08), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.04)" }} />
            <div className="absolute inset-0 z-0 rounded-xl border border-white/[0.06]" />

            {/* Content */}
            <div className="relative z-30 flex flex-col items-center justify-center gap-3 p-4">
                {skill.iconUrl ? (
                    <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 md:w-14 md:h-14 object-contain opacity-80" />
                ) : (
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <span className="text-white/30 text-lg font-bold">{skill.name.charAt(0)}</span>
                    </div>
                )}
                <span className="text-white/50 text-[10px] md:text-xs font-bold uppercase" style={{ letterSpacing: "0.1em" }}>
                    {skill.name}
                </span>
            </div>
        </motion.div>
    );
}

function SkillDetailPopup({
    skill,
    originRect,
    onClose,
}: {
    skill: Skill;
    originRect: DOMRect;
    onClose: () => void;
}) {
    // Calculate center position for the expanded card
    const [windowSize, setWindowSize] = useState({ w: 1024, h: 768 });

    useEffect(() => {
        setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    }, []);

    // The expanded card is 2x2 of the original icon size
    const cardSize = Math.min(320, windowSize.w - 40);
    const centerX = (windowSize.w - cardSize) / 2;
    const centerY = (windowSize.h - cardSize) / 2;

    // Origin position (icon block)
    const originX = originRect.left;
    const originY = originRect.top;
    const originW = originRect.width;
    const originH = originRect.height;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                onClick={onClose}
            />

            {/* Card with flip animation */}
            <motion.div
                className="fixed z-[201] cursor-pointer"
                style={{ perspective: "1000px" }}
                initial={{
                    left: originX,
                    top: originY,
                    width: originW,
                    height: originH,
                }}
                animate={{
                    left: centerX,
                    top: centerY,
                    width: cardSize,
                    height: cardSize,
                }}
                exit={{
                    left: originX,
                    top: originY,
                    width: originW,
                    height: originH,
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 180 }}
                    exit={{ rotateY: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {/* Front face (icon) */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#1a1a1a] border border-white/[0.1]"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        {skill.iconUrl ? (
                            <img src={skill.iconUrl} alt={skill.name} className="w-14 h-14 object-contain opacity-80" />
                        ) : (
                            <div className="w-14 h-14 rounded-lg bg-white/[0.06] flex items-center justify-center">
                                <span className="text-white/30 text-2xl font-bold">{skill.name.charAt(0)}</span>
                            </div>
                        )}
                        <span className="text-white/50 text-xs font-bold uppercase mt-3">{skill.name}</span>
                    </div>

                    {/* Back face (details) */}
                    <div
                        className="absolute inset-0 flex flex-col rounded-2xl bg-[#1a1a1a] border border-white/[0.15] p-6 overflow-hidden"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                        {/* Icon + Name */}
                        <div className="flex items-center gap-3 mb-4">
                            {skill.iconUrl ? (
                                <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                                    <span className="text-white/30 text-lg font-bold">{skill.name.charAt(0)}</span>
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                        </div>

                        {/* Level */}
                        <div className="mb-3">
                            <span className="text-white/40 text-xs uppercase font-medium mr-2">Level</span>
                            <LevelStars level={skill.level} />
                        </div>

                        {/* Type */}
                        <div className="mb-3">
                            <span className="text-white/40 text-xs uppercase font-medium mr-2">Type</span>
                            <span className="text-white/70 text-sm">{skill.category}</span>
                        </div>

                        {/* Detail */}
                        <div className="flex-1 overflow-y-auto">
                            <span className="text-white/40 text-xs uppercase font-medium block mb-1">Detail</span>
                            <p className="text-white/60 text-sm leading-relaxed">{skill.detail}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}

export default function SkillsContent({ skills }: SkillsContentProps) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSkill, setSelectedSkill] = useState<{ skill: Skill; rect: DOMRect } | null>(null);

    const filteredSkills = useMemo(() => {
        if (selectedCategory === "All") return skills;
        return skills.filter((s) => s.category === selectedCategory);
    }, [skills, selectedCategory]);

    // Get unique categories from data
    const availableCategories = useMemo(() => {
        const cats = new Set(skills.map((s) => s.category));
        return CATEGORIES.filter((c) => c === "All" || cats.has(c));
    }, [skills]);

    const handleSelect = (skill: Skill, rect: DOMRect) => {
        setSelectedSkill({ skill, rect });
    };

    return (
        <div className="w-full">
            <GlassFilter />

            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
                    Tech Stack
                </h3>
                <div className="w-10 h-[1px] bg-white/20 mx-auto mt-4" />
            </div>

            {/* Category Filter */}
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
                {availableCategories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                                isActive
                                    ? "font-bold border-[#B1B1B1] text-[#B1B1B1] bg-white/[0.08]"
                                    : "border-white/[0.08] text-white/30 hover:text-white/50 bg-white/[0.03]"
                            }`}
                            style={isActive ? { fontWeight: 700 } : {}}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={selectedCategory}
                className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-3xl mx-auto"
            >
                {filteredSkills.map((skill) => (
                    <SkillCard
                        key={skill.id}
                        skill={skill}
                        onSelect={handleSelect}
                    />
                ))}
            </motion.div>

            {filteredSkills.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-white/30 text-sm">No skills in this category.</p>
                </div>
            )}

            {/* Detail Popup */}
            <AnimatePresence>
                {selectedSkill && (
                    <SkillDetailPopup
                        skill={selectedSkill.skill}
                        originRect={selectedSkill.rect}
                        onClose={() => setSelectedSkill(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
