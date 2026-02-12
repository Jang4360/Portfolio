"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    period: string;
    techStack: string[];
    role: string;
    coverImage: string;
    architectureImage: string;
    description: string;
    repoLink: string | null;
    summaryContent: string;
    features: string;
    troubleshooting: string;
}

interface ProjectsContentProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

const getVisibleCount = (width: number): number => {
    if (width >= 1280) return 3;
    if (width >= 768) return 2;
    return 1;
};

export default function ProjectsContent({ projects, onProjectClick }: ProjectsContentProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(1024);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
    const [direction, setDirection] = useState(1);
    const [refreshedImages, setRefreshedImages] = useState<Record<string, { coverImage: string; architectureImage: string }>>({});

    const refreshProjectImage = useCallback(async (projectId: string) => {
        try {
            const res = await fetch(`/api/project-images?pageId=${projectId}&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.coverImage || data.architectureImage) {
                    setRefreshedImages(prev => ({ ...prev, [projectId]: data }));
                }
            }
        } catch {
            // silently fail
        }
    }, []);

    const getCoverImage = useCallback((project: Project) => {
        return refreshedImages[project.id]?.coverImage || project.coverImage;
    }, [refreshedImages]);

    // Proactively refresh all project images on mount
    useEffect(() => {
        projects.forEach((project) => {
            if (project.coverImage || project.architectureImage) {
                // Check if image URL is a Notion temporary URL (contains amazonaws or secure.notion)
                const isTemporary = (url: string) =>
                    url.includes('amazonaws.com') || url.includes('secure.notion');
                if (isTemporary(project.coverImage) || isTemporary(project.architectureImage)) {
                    refreshProjectImage(project.id);
                }
            }
        });
    }, [projects, refreshProjectImage]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleResize = () => {
            const newWidth = window.innerWidth;
            setWindowWidth(newWidth);
            const newVisible = getVisibleCount(newWidth);
            const maxIdx = Math.max(0, projects.length - newVisible);
            setCurrentIndex((prev) => Math.min(prev, maxIdx));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [projects.length]);

    useEffect(() => {
        if (!isAutoPlaying || projects.length === 0) return;

        autoPlayRef.current = setInterval(() => {
            const visibleCount = getVisibleCount(windowWidth);
            const maxIndex = projects.length - visibleCount;

            setCurrentIndex((prev) => {
                if (prev >= maxIndex) {
                    setDirection(-1);
                    return prev - 1;
                } else if (prev <= 0) {
                    setDirection(1);
                    return prev + 1;
                }
                return prev + direction;
            });
        }, 4000);

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlaying, windowWidth, direction, projects.length]);

    const visibleCount = getVisibleCount(windowWidth);
    const maxIndex = Math.max(0, projects.length - visibleCount);
    const canGoNext = currentIndex < maxIndex;
    const canGoPrev = currentIndex > 0;

    const goNext = () => {
        if (canGoNext) {
            setDirection(1);
            setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
            pauseAutoPlay();
        }
    };

    const goPrev = () => {
        if (canGoPrev) {
            setDirection(-1);
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
            pauseAutoPlay();
        }
    };

    const pauseAutoPlay = () => {
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 8000);
    };

    const handleDragEnd = (_: any, info: any) => {
        const { offset } = info;
        if (offset.x < -30 && canGoNext) goNext();
        else if (offset.x > 30 && canGoPrev) goPrev();
    };

    if (projects.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-white/50 text-lg">No projects yet.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
                    Projects
                </h3>
                <div className="w-10 h-[1px] bg-white/20 mx-auto mt-4" />
            </div>

            {/* Navigation */}
            <div className="relative">
                <div className="flex justify-end gap-2 mb-4">
                    <button
                        onClick={goPrev}
                        disabled={!canGoPrev}
                        className={`p-1.5 rounded-full transition-all duration-300 ${canGoPrev
                                ? "bg-white/[0.06] hover:bg-white/[0.12] text-white/60"
                                : "bg-white/[0.03] text-white/15 cursor-not-allowed"
                            }`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={goNext}
                        disabled={!canGoNext}
                        className={`p-1.5 rounded-full transition-all duration-300 ${canGoNext
                                ? "bg-white/[0.06] hover:bg-white/[0.12] text-white/60"
                                : "bg-white/[0.03] text-white/15 cursor-not-allowed"
                            }`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Cards */}
                <div className="overflow-hidden">
                    <motion.div
                        className="flex"
                        animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
                        transition={{ type: "spring", stiffness: 70, damping: 20 }}
                    >
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                className={`flex-shrink-0 p-2 ${visibleCount === 3
                                        ? "w-1/3"
                                        : visibleCount === 2
                                            ? "w-1/2"
                                            : "w-full"
                                    }`}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ cursor: "grab" }}
                            >
                                <div
                                    onClick={() => onProjectClick(project)}
                                    className="relative overflow-hidden rounded-xl p-5 h-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.12] cursor-pointer transition-all duration-500 hover:bg-white/[0.07] hover:border-white/[0.2]"
                                >
                                    {/* Cover Image */}
                                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                                        {getCoverImage(project) ? (
                                            <img
                                                src={getCoverImage(project)}
                                                alt={project.name}
                                                className="w-full h-full object-cover"
                                                style={{ filter: "brightness(0.7)" }}
                                                onError={() => {
                                                    refreshProjectImage(project.id);
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-white/[0.06] to-white/[0.02]" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <h4 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "0.02em" }}>
                                        {project.name}
                                    </h4>
                                    <p className="text-base mb-3 line-clamp-2" style={{ color: '#F5F5F5' }}>
                                        {project.tagline}
                                    </p>

                                    {/* Period & Role */}
                                    <div className="flex items-center gap-2 text-sm mb-3 uppercase" style={{ letterSpacing: "0.05em", color: '#F5F5F5' }}>
                                        {project.period && <span>{project.period}</span>}
                                        {project.period && project.role && <span className="text-white/15">|</span>}
                                        {project.role && <span>{project.role}</span>}
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.techStack.slice(0, 4).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-[10px] text-white/50"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 4 && (
                                            <span className="px-2 py-0.5 text-[10px] text-white/20">
                                                +{project.techStack.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Dots */}
                <div className="flex justify-center mt-6 gap-1.5">
                    {Array.from(
                        { length: Math.max(1, projects.length - visibleCount + 1) },
                        (_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    pauseAutoPlay();
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "bg-white w-5"
                                        : "bg-white/30 hover:bg-white/50"
                                    }`}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
