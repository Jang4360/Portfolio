import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub } from 'react-icons/fi';
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

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('features');

    const tabContent = {
        features: project.features,
        troubleshooting: project.troubleshooting,
        architecture: null, // Handled separately
    };

    const tabs = [
        { id: 'features' as Tab, label: 'Detailed Features' },
        { id: 'troubleshooting' as Tab, label: 'Troubleshooting' },
        { id: 'architecture' as Tab, label: 'Architecture Diagram' },
    ];

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
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#0a0a0a] rounded-xl shadow-2xl z-[101] overflow-hidden flex flex-col border border-white/[0.06]"
                    >
                        {/* Close Button - Moved higher */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-4 z-10 p-2 bg-white/[0.06] hover:bg-white/[0.12] rounded-full transition-colors border border-white/[0.08]"
                        >
                            <FiX size={24} className="text-white" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full overflow-hidden">
                            {/* Left Column */}
                            <div className="w-full md:w-2/5 lg:w-1/3 bg-white/[0.02] p-6 md:p-8 overflow-y-auto border-r border-white/[0.06]">

                                <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                                <p className="text-white/40 mb-4 leading-relaxed text-sm">{project.tagline}</p>

                                {/* Period & Role */}
                                <div className="flex flex-col gap-1 mb-4 text-sm text-white/30">
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

                                {/* Cover Image - Moved Here */}
                                {project.coverImage && (
                                    <motion.img
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        src={project.coverImage}
                                        alt={project.name}
                                        className="w-full h-auto object-cover rounded-lg shadow-lg"
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
                                                project.architectureImage ? (
                                                    <div className="flex flex-col items-center">
                                                        <img
                                                            src={project.architectureImage}
                                                            alt="Architecture Diagram"
                                                            className="w-full max-w-4xl rounded-lg shadow-2xl"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-white/20 py-12">
                                                        <p className="text-lg">No architecture diagram available.</p>
                                                    </div>
                                                )
                                            ) : (
                                                tabContent[activeTab] ? (
                                                    <ReactMarkdown
                                                        components={{
                                                            h1: ({ ...props }) => (
                                                                <h1 className="text-3xl font-bold text-white mb-4" {...props} />
                                                            ),
                                                            h2: ({ ...props }) => (
                                                                <h2 className="text-2xl font-bold text-white mb-3 mt-6" {...props} />
                                                            ),
                                                            h3: ({ ...props }) => (
                                                                <h3 className="text-xl font-bold text-white mb-2 mt-4" {...props} />
                                                            ),
                                                            p: ({ ...props }) => (
                                                                <p className="text-white/50 leading-relaxed mb-4" {...props} />
                                                            ),
                                                            ul: ({ ...props }) => (
                                                                <ul className="list-disc list-inside text-white/50 mb-4 space-y-2" {...props} />
                                                            ),
                                                            ol: ({ ...props }) => (
                                                                <ol className="list-decimal list-inside text-white/50 mb-4 space-y-2" {...props} />
                                                            ),
                                                            code: ({ inline, ...props }: any) =>
                                                                inline ? (
                                                                    <code className="px-2 py-1 bg-white/[0.06] rounded text-white/70 text-sm" {...props} />
                                                                ) : (
                                                                    <code className="block p-4 bg-white/[0.04] rounded-lg text-sm overflow-x-auto text-white/60" {...props} />
                                                                ),
                                                            blockquote: ({ ...props }) => (
                                                                <blockquote className="border-l-2 border-white/20 pl-4 italic text-white/40 my-4" {...props} />
                                                            ),
                                                            a: ({ ...props }) => (
                                                                <a className="text-white/70 hover:text-white underline" {...props} />
                                                            ),
                                                        }}
                                                    >
                                                        {tabContent[activeTab]}
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
