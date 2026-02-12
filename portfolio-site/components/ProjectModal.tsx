import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub } from 'react-icons/fi';
// Unused imports removed
import ReactMarkdown from 'react-markdown';

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

interface ProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'features' | 'troubleshooting' | 'architecture';

// Map heading keywords to icons and accent colors
// function getHeadingMeta removed

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('features');
    const [freshImages, setFreshImages] = useState<{ coverImage: string; architectureImage: string } | null>(null);

    const refreshImages = useCallback(async () => {
        if (!project?.id) return;
        try {
            const timestamp = Date.now();
            const res = await fetch(`/api/project-images?pageId=${project.id}&t=${timestamp}`);
            if (res.ok) {
                const data = await res.json();
                // Append timestamp to image URLs to bypass browser/CDN cache
                // Check if URL already has query params
                const appendTimestamp = (url: string) => {
                    if (!url) return '';
                    const separator = url.includes('?') ? '&' : '?';
                    return `${url}${separator}t=${timestamp}`;
                };

                if (data.coverImage || data.architectureImage) {
                    setFreshImages({
                        coverImage: appendTimestamp(data.coverImage),
                        architectureImage: appendTimestamp(data.architectureImage)
                    });
                }
            }
        } catch { /* silently fail */ }
    }, [project?.id]);

    useEffect(() => {
        if (isOpen && project?.id) {
            setFreshImages(null);
            setActiveTab('features');
            refreshImages();
        }
    }, [isOpen, project?.id, refreshImages]);

    const coverImage = freshImages?.coverImage || project.coverImage;
    const architectureImage = freshImages?.architectureImage || project.architectureImage;

    const tabContent = {
        features: project.features,
        troubleshooting: project.troubleshooting,
        architecture: null,
    };

    const tabs = [
        { id: 'features' as Tab, label: 'Detailed Features' },
        { id: 'troubleshooting' as Tab, label: 'Troubleshooting' },
        { id: 'architecture' as Tab, label: 'Architecture Diagram' },
    ];

    const markdownComponents = useMemo(() => ({
        h1: ({ ...props }: any) => (
            <div className="mt-4 mb-5">
                <h1 className="text-2xl font-bold text-white" {...props} />
                <div className="mt-2 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
            </div>
        ),
        h2: ({ ...props }: any) => (
            <div className="mt-8 mb-4">
                <h2 className="text-xl font-bold text-white mb-2" {...props} />
                <div className="h-[1px] bg-gradient-to-r from-white/15 via-white/[0.06] to-transparent" />
            </div>
        ),
        h3: ({ ...props }: any) => (
            <div className="mt-6 mb-3">
                <h3 className="text-lg font-bold text-white" {...props} />
            </div>
        ),
        p: ({ ...props }: any) => (
            <p className="text-white/70 leading-relaxed mb-3 text-sm pl-0.5" {...props} />
        ),
        ul: ({ ...props }: any) => (
            <ul className="list-disc pl-5 text-white/70 mb-4 space-y-1.5 text-sm" {...props} />
        ),
        ol: ({ ...props }: any) => (
            <ol className="list-decimal pl-5 text-white/70 mb-4 space-y-1.5 text-sm" {...props} />
        ),
        li: ({ ...props }: any) => (
            <li className="text-white/70 leading-relaxed" {...props} />
        ),
        strong: ({ ...props }: any) => (
            <strong className="text-white font-semibold" {...props} />
        ),
        code: ({ inline, ...props }: any) =>
            inline ? (
                <code className="px-1.5 py-0.5 bg-white/[0.08] rounded text-white/80 text-[13px] font-mono" {...props} />
            ) : (
                <code className="block p-4 bg-white/[0.04] rounded-lg text-[13px] overflow-x-auto text-white/70 font-mono border border-white/[0.06]" {...props} />
            ),
        blockquote: ({ ...props }: any) => (
            <blockquote className="border-l-2 border-blue-400/40 pl-4 italic text-white/50 my-4 bg-blue-400/[0.03] py-2 rounded-r-lg" {...props} />
        ),
        a: ({ ...props }: any) => (
            <a className="text-blue-400/80 hover:text-blue-300 underline underline-offset-2" {...props} />
        ),
        hr: () => (
            <div className="my-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        ),
    }), []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#0a0a0a] rounded-xl shadow-2xl z-[101] overflow-hidden flex flex-col border border-[#444]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-full transition-colors border border-white/[0.08]"
                        >
                            <FiX size={16} className="text-white" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full overflow-hidden">
                            {/* Left Column */}
                            <div className="w-full md:w-2/5 lg:w-1/3 bg-white/[0.02] p-6 md:p-8 overflow-y-auto border-r border-white/[0.06]">

                                <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                                <p className="text-lg mb-4 leading-relaxed" style={{ color: '#F5F5F5' }}>{project.tagline}</p>

                                {/* Period & Role */}
                                <div className="flex flex-col gap-1 mb-4 text-sm" style={{ color: '#F5F5F5' }}>
                                    {project.period && (
                                        <span>Period: {project.period}</span>
                                    )}
                                    {project.role && (
                                        <span>Role: {project.role}</span>
                                    )}
                                </div>

                                {/* Links */}
                                <div className="flex gap-3 mb-6">
                                    {project.repoLink && (
                                        <a
                                            href={project.repoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg transition-colors text-white/70 font-medium border border-white/[0.08]"
                                        >
                                            <FiGithub size={18} />
                                            Repo
                                        </a>
                                    )}
                                </div>

                                {/* Tech Stack */}
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-bold text-white/30 uppercase mb-3" style={{ letterSpacing: "0.15em" }}>
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-white/[0.06] border border-white/[0.1] rounded-full text-xs text-white/50 font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Cover Image */}
                                {coverImage && (
                                    <motion.img
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        src={coverImage}
                                        alt={project.name}
                                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                                        onError={() => {
                                            refreshImages();
                                        }}
                                    />
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex border-b border-white/[0.06] bg-white/[0.02]">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 px-4 py-4 text-sm font-bold transition-colors relative ${activeTab === tab.id
                                                ? 'text-white'
                                                : 'text-white/30 hover:text-white/60'
                                                }`}
                                        >
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/60"
                                                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="prose prose-invert prose-lg max-w-none"
                                        >
                                            {activeTab === 'architecture' ? (
                                                architectureImage ? (
                                                    <div className="flex flex-col items-center">
                                                        <img
                                                            src={architectureImage}
                                                            alt="Architecture Diagram"
                                                            className="w-full max-w-4xl rounded-lg shadow-2xl"
                                                            onError={() => {
                                                                refreshImages();
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-white/20 py-12">
                                                        <p className="text-lg">No architecture diagram available.</p>
                                                    </div>
                                                )
                                            ) : (
                                                tabContent[activeTab] ? (
                                                    <ReactMarkdown components={markdownComponents}>
                                                        {tabContent[activeTab]!}
                                                    </ReactMarkdown>
                                                ) : (
                                                    <div className="text-center text-white/20 py-12">
                                                        <p className="text-lg">No content available for this section.</p>
                                                    </div>
                                                )
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
