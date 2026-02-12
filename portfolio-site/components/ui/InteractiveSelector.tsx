"use client";

import React, { useState, useEffect } from 'react';

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
    const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
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

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        options.forEach((_, i) => {
            const timer = setTimeout(() => {
                setAnimatedOptions(prev => [...prev, i]);
            }, 100 * i);
            timers.push(timer);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [options]);

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[450px] text-white select-none"> {/* Reduced min-h from 500px to 450px */}
            <div
                className="options flex w-full max-w-[1200px] h-[500px] items-stretch overflow-hidden relative gap-2" // Reduced h from 600px to 500px
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`
              relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out rounded-2xl
              ${activeIndex === index ? 'active flex-[7]' : 'flex-1'}
            `}
                        style={{
                            backgroundImage: option.bgImage ? `url('${option.bgImage}')` : undefined,
                            backgroundColor: option.bgColor || '#18181b',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer',
                            opacity: animatedOptions.includes(index) ? 1 : 0,
                            transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-20px)',
                            boxShadow: activeIndex === index
                                ? '0 20px 60px rgba(0,0,0,0.50)'
                                : '0 10px 30px rgba(0,0,0,0.30)',
                            border: activeIndex === index ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                        }}
                        onClick={() => handleOptionClick(index)}
                    >
                        {/* Gradient Overlay */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none transition-opacity duration-700"
                            style={{ opacity: activeIndex === index ? 1 : 0.8 }}
                        />

                        {/* Label with icon and info */}
                        <div className={`relative z-10 flex flex-col px-6 pb-6 pt-4 h-full justify-end transition-all duration-500 overflow-hidden ${activeIndex === index ? 'items-start' : 'items-center'}`}>

                            {/* Icon Container */}
                            <div
                                className={`flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-500 shrink-0
                  ${activeIndex === index ? 'w-12 h-12 mb-2' : 'w-10 h-10 mb-2'} 
                `} // Reduced mb-4 to mb-2, and w-14 to w-12 for active state to reduce padding/size
                            >
                                {option.icon}
                            </div>

                            {/* Text Content */}
                            <div className={`transition-all duration-700 ease-in-out whitespace-nowrap w-full flex flex-col
                 ${activeIndex === index ? 'opacity-100 flex-1 justify-end overflow-visible' : 'opacity-100 max-h-[80px] items-center'}
              `}>
                                <h3 className={`font-bold transition-all duration-300 ${activeIndex === index ? 'text-2xl mb-1' : 'text-sm rotate-0'}`}> {/* Reduced text-3xl to text-2xl, mb-2 to mb-1 */}
                                    {option.title}
                                </h3>

                                <p className={`text-gray-300 transition-all duration-300 whitespace-normal ${activeIndex === index ? 'text-base mb-4' : 'text-xs opacity-0 hidden'}`}> {/* Reduced text-lg to text-base, mb-6 to mb-4 */}
                                    {option.description}
                                </p>

                                {/* Detailed Content */}
                                <div
                                    className={`transition-all duration-700 delay-100 whitespace-normal w-full overflow-y-auto min-h-0 scrollbar-hide
                    ${activeIndex === index ? 'opacity-100 translate-y-0 max-h-[300px]' : 'opacity-0 translate-y-4 absolute h-0'}
                  `}
                                >
                                    {option.details}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
