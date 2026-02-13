"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface WordGroup {
  text: string;
  image: string;
  fontWeight: number;
}

interface RevealTextProps {
  wordGroups: WordGroup[];
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
}

export function RevealText({
  wordGroups,
  fontSize = "text-4xl md:text-5xl",
  letterDelay = 0.06,
  overlayDelay = 0.03,
  overlayDuration = 0.4,
  springDuration = 600,
}: RevealTextProps) {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const groupRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const totalLetters = wordGroups.reduce((acc, g) => acc + g.text.length, 0);

  useEffect(() => {
    const lastLetterDelay = (totalLetters - 1) * letterDelay;
    const totalDelay = lastLetterDelay * 1000 + springDuration;

    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [totalLetters, letterDelay, springDuration]);

  let globalIndex = 0;

  return (
    <div className="flex items-center justify-center relative">
      <div className="flex flex-wrap justify-center">
        {wordGroups.map((group, groupIdx) => {
          const groupStartIndex = globalIndex;
          const letters = group.text.split("");

          const groupElement = (
            <span
              key={groupIdx}
              ref={(el) => { groupRefs.current[groupIdx] = el; }}
              className="relative inline-flex"
              onMouseEnter={() => setHoveredGroup(groupIdx)}
              onMouseLeave={() => setHoveredGroup(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Background image layer that spans the entire word group */}
              <span
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{
                  opacity: hoveredGroup === groupIdx ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <span
                  className={`${fontSize} absolute inset-0 bg-cover bg-center bg-no-repeat`}
                  style={{
                    backgroundImage: `url('${group.image}')`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontWeight: group.fontWeight,
                    letterSpacing: "0.05em",
                  }}
                >
                  {group.text.split("").map((l, i) => (
                    <span key={i} className="inline-block" style={{ visibility: "visible" }}>
                      {l === " " ? "\u00A0" : l}
                    </span>
                  ))}
                </span>
              </span>

              {/* Individual animated letters */}
              {letters.map((letter, letterIdx) => {
                const currentGlobalIndex = groupStartIndex + letterIdx;

                return (
                  <motion.span
                    key={letterIdx}
                    className={`${fontSize} tracking-tight relative inline-block`}
                    style={{
                      fontFamily: "'Noto Sans KR', sans-serif",
                      fontWeight: group.fontWeight,
                      letterSpacing: "0.05em",
                    }}
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay: currentGlobalIndex * letterDelay,
                      type: "spring",
                      damping: 8,
                      stiffness: 200,
                      mass: 0.8,
                    }}
                  >
                    {/* Base text layer (white) */}
                    <span
                      className="text-white"
                      style={{
                        opacity: hoveredGroup === groupIdx ? 0 : 1,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>

                    {/* Transparent placeholder when hovering (image shown via group layer) */}
                    <span
                      className="absolute inset-0"
                      style={{
                        opacity: hoveredGroup === groupIdx ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        color: "transparent",
                      }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>

                    {/* Overlay sweep */}
                    {showOverlay && (
                      <motion.span
                        className="absolute inset-0 text-[#2396ED] pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                          delay: currentGlobalIndex * overlayDelay,
                          duration: overlayDuration,
                          times: [0, 0.1, 0.7, 1],
                          ease: "easeInOut",
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    )}
                  </motion.span>
                );
              })}
            </span>
          );

          globalIndex += letters.length;
          return groupElement;
        })}
      </div>
    </div>
  );
}
