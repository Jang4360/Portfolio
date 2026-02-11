"use client";

import React from "react";
import { motion } from "framer-motion";

const skillIcons = [
    { name: "Spring", src: "/images/svg/SPRING.svg" },
    { name: "AWS", src: "/images/svg/AWS.svg" },
    { name: "Docker", src: "/images/svg/DOCKER.svg" },
    { name: "Jenkins", src: "/images/svg/JENKINS.svg" },
    { name: "Nginx", src: "/images/svg/NGINX.svg" },
    { name: "PostgreSQL", src: "/images/svg/POSTGRESQL.svg" },
    { name: "MySQL", src: "/images/svg/MYSQL.svg" },
    { name: "Redis", src: "/images/svg/REDIS.svg" },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
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

// SVG Filter for glass distortion
function GlassFilter() {
    return (
        <svg className="glass-filter-svg">
            <filter
                id="glass-distortion"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                filterUnits="objectBoundingBox"
            >
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.001 0.005"
                    numOctaves="1"
                    seed="17"
                    result="turbulence"
                />
                <feGaussianBlur
                    in="turbulence"
                    stdDeviation="3"
                    result="softMap"
                />
                <feSpecularLighting
                    in="softMap"
                    surfaceScale="5"
                    specularConstant="1"
                    specularExponent="100"
                    lightingColor="white"
                    result="specLight"
                >
                    <fePointLight x="-200" y="-200" z="300" />
                </feSpecularLighting>
                <feComposite
                    in="specLight"
                    operator="arithmetic"
                    k1="0"
                    k2="1"
                    k3="1"
                    k4="0"
                    result="litImage"
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="softMap"
                    scale="200"
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        </svg>
    );
}

function GlassCard({
    name,
    src,
    index,
}: {
    name: string;
    src: string;
    index: number;
}) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex flex-col items-center justify-center aspect-square rounded-2xl cursor-pointer overflow-hidden transition-all duration-700"
            style={{
                boxShadow:
                    "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
                transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
            }}
        >
            {/* Glass layers */}
            <div
                className="absolute inset-0 z-0 overflow-hidden rounded-xl"
                style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                }}
            />
            <div
                className="absolute inset-0 z-10 rounded-xl"
                style={{ background: "rgba(255, 255, 255, 0.03)" }}
            />
            <div
                className="absolute inset-0 z-20 rounded-xl overflow-hidden"
                style={{
                    boxShadow:
                        "inset 1px 1px 1px 0 rgba(255, 255, 255, 0.08), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.04)",
                }}
            />
            <div className="absolute inset-0 z-0 rounded-xl border border-white/[0.06]" />

            {/* Content */}
            <div className="relative z-30 flex flex-col items-center justify-center gap-3 p-4">
                <img
                    src={src}
                    alt={name}
                    className="w-10 h-10 md:w-14 md:h-14 object-contain opacity-80"
                />
                <span className="text-white/50 text-[10px] md:text-xs font-bold uppercase" style={{ letterSpacing: "0.1em" }}>
                    {name}
                </span>
            </div>
        </motion.div>
    );
}

export default function SkillsContent() {
    return (
        <div className="w-full">
            <GlassFilter />

            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
                    Tech Stack
                </h3>
                <div className="w-10 h-[1px] bg-white/20 mx-auto mt-4" />
            </div>

            {/* Grid: 5 per row */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-3xl mx-auto"
            >
                {skillIcons.map((skill, index) => (
                    <GlassCard
                        key={skill.name}
                        name={skill.name}
                        src={skill.src}
                        index={index}
                    />
                ))}
            </motion.div>
        </div>
    );
}
