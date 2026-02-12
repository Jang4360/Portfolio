"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectorOption {
    title: string;
    description: string;
    details?: React.ReactNode;
    icon: React.ReactNode;
    bgImage?: string;
    bgColor?: string;
}

interface InteractiveSelectorProps {
    options: SelectorOption[];
}

export const InteractiveSelector: React.FC<InteractiveSelectorProps> = ({ options }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && activeIndex < options.length - 1) {
            handleOptionClick(activeIndex + 1);
        }
        if (isRightSwipe && activeIndex > 0) {
            handleOptionClick(activeIndex - 1);
        }
    };

    const handleOptionClick = (index: number) => {
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[450px] text-white select-none">
            <div
                className="flex w-full max-w-[1200px] h-[500px] items-stretch overflow-hidden relative gap-2"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {options.map((option, index) => {
                    const isActive = activeIndex === index;

                    return (
                        <motion.div
                            key={index}
                            layout
                            onClick={() => handleOptionClick(index)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                layout: { duration: 0.5, type: "spring", stiffness: 100, damping: 20 },
                                opacity: { duration: 0.5 },
                            }}
                            className={`relative flex flex-col overflow-hidden rounded-2xl cursor-pointer border ${isActive
                                ? "flex-[7] border-white/20 shadow-2xl"
                                : "flex-1 border-white/5 hover:border-white/10"
                                }`}
                            style={{
                                backgroundImage: option.bgImage ? `url('${option.bgImage}')` : undefined,
                                backgroundColor: option.bgColor || '#18181b',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {/* Gradient Overlay & Filter */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                animate={{
                                    background: isActive
                                        ? 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.30) 100%)'
                                        : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.30) 100%)',
                                    backdropFilter: 'brightness(0.65) saturate(0.8)' // Darkens and slightly desaturates
                                }}
                            />

                            {/* Content Wrapper */}
                            <div className="relative z-10 w-full h-full">
                                <AnimatePresence mode="popLayout">
                                    {!isActive ? (
                                        <motion.div
                                            key={`inactive-${index}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center px-4"
                                        >
                                            <div className="flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-10 h-10 mb-2 shrink-0">
                                                {option.icon}
                                            </div>
                                            <h3 className="font-bold text-sm whitespace-nowrap rotate-0">{option.title}</h3>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={`active-${index}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col justify-between px-6 pb-6 pt-6"
                                        >
                                            {/* Icon - Top Left */}
                                            <motion.div
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className="flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-12 h-12 shrink-0"
                                            >
                                                {option.icon}
                                            </motion.div>

                                            {/* Content - Bottom */}
                                            <div>
                                                <motion.h3
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="font-bold text-[32px] mb-0.5 whitespace-nowrap"
                                                >
                                                    {option.title}
                                                </motion.h3>

                                                <motion.p
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="text-gray-300 text-[24px] mb-4"
                                                >
                                                    {option.description}
                                                </motion.p>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="w-full overflow-y-auto max-h-[300px] scrollbar-hide"
                                                >
                                                    {option.details}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
