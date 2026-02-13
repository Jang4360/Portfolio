"use client";

import { motion } from "framer-motion";

export function HeroTextEffect() {
    const words = [
        { text: "측정", highlight: false },
        { text: "가능한", highlight: false },
        { text: "가치", highlight: true }, // The word to highlight
        { text: "를", highlight: false },
        { text: "만드는", highlight: false },
        { text: "개발자", highlight: false },
    ];

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 },
        },
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }} // Added flex and center
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }} // Animate only once
            className="text-4xl md:text-5xl font-bold text-white text-center tracking-tight"
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "0.25em" }} // Add spacing between words
                    key={index}
                    className={word.highlight ? "text-[#2396ED]" : "text-white"}
                >
                    {word.text}
                </motion.span>
            ))}
        </motion.div>
    );
}
