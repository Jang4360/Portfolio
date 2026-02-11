"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface HeroProps {
    backgroundImage: string;
    title: string;
    subtitle: string[];
}

export function Hero({ backgroundImage, title, subtitle }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-[120%]"
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${backgroundImage}')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-bold mb-8 text-white"
                >
                    {title}
                </motion.h1>

                <div className="space-y-4">
                    {subtitle.map((text, index) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                            className="text-3xl md:text-5xl font-semibold"
                            style={{
                                color: index === 0 ? "#60A5FA" : index === 1 ? "#34D399" : "#A78BFA",
                            }}
                        >
                            {text}
                        </motion.p>
                    ))}
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-white rounded-full p-2"
                    >
                        <motion.div className="w-1.5 h-1.5 bg-white rounded-full mx-auto" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
