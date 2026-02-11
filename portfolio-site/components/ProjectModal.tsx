import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

interface ProjectModalProps {
    project: {
        id: string;
        title: string;
        summary: string;
        coverImage: string;
        demoUrl: string;
        repoUrl: string;
        techStack: string[];
        summaryContent: string;
        features: string;
        troubleshooting: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'summary' | 'features' | 'troubleshooting';

/**
 * ProjectModal 컴포넌트
 * 
 * 구조:
 * - 좌측 (Left Col): 프로젝트 커버 이미지, 링크, 기술 스택
 * - 우측 (Right Col): 탭 UI로 Summary, Detailed Features, Troubleshooting 전환
 * 
 * Notion에서 파싱된 마크다운 컨텐츠를 탭별로 렌더링
 */
export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('summary');

    // 탭별 컨텐츠 매핑
    const tabContent = {
        summary: project.summaryContent || project.summary,
        features: project.features,
        troubleshooting: project.troubleshooting,
    };

    // 탭 설정
    const tabs = [
        { id: 'summary' as Tab, label: 'Summary', icon: '📝' },
        { id: 'features' as Tab, label: 'Detailed Features', icon: '⚙️' },
        { id: 'troubleshooting' as Tab, label: 'Troubleshooting', icon: '🔧' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop (배경 오버레이) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                            aria-label="Close modal"
                        >
                            <FiX size={24} className="text-white" />
                        </button>

                        {/* Content Grid: 좌측 + 우측 */}
                        <div className="flex flex-col md:flex-row h-full overflow-hidden">

                            {/* ========================================
                  LEFT COLUMN: 프로젝트 정보
                  ======================================== */}
                            <div className="w-full md:w-2/5 lg:w-1/3 bg-gray-800 p-6 md:p-8 overflow-y-auto">
                                {/* 프로젝트 커버 이미지 */}
                                {project.coverImage && (
                                    <motion.img
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        src={project.coverImage}
                                        alt={project.title}
                                        className="w-full h-48 md:h-64 object-cover rounded-lg mb-6 shadow-lg"
                                    />
                                )}

                                {/* 프로젝트 제목 */}
                                <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>

                                {/* 프로젝트 요약 */}
                                <p className="text-gray-300 mb-6 leading-relaxed">{project.summary}</p>

                                {/* 링크 버튼들 */}
                                <div className="flex gap-3 mb-6">
                                    {project.demoUrl && (
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
                                        >
                                            <FiExternalLink size={18} />
                                            Demo
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium"
                                        >
                                            <FiGithub size={18} />
                                            Repo
                                        </a>
                                    )}
                                </div>

                                {/* 기술 스택 */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ========================================
                  RIGHT COLUMN: 탭 컨텐츠
                  ======================================== */}
                            <div className="flex-1 flex flex-col overflow-hidden">

                                {/* Tab Navigation */}
                                <div className="flex border-b border-gray-700 bg-gray-800/50">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 px-4 py-4 font-semibold transition-colors relative ${activeTab === tab.id
                                                    ? 'text-white bg-gray-900/50'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                                                }`}
                                        >
                                            <span className="mr-2">{tab.icon}</span>
                                            {tab.label}

                                            {/* Active Indicator */}
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
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
                                            {tabContent[activeTab] ? (
                                                <ReactMarkdown
                                                    components={{
                                                        // 마크다운 컴포넌트 커스터마이징
                                                        h1: ({ node, ...props }) => (
                                                            <h1 className="text-3xl font-bold text-white mb-4" {...props} />
                                                        ),
                                                        h2: ({ node, ...props }) => (
                                                            <h2 className="text-2xl font-bold text-white mb-3 mt-6" {...props} />
                                                        ),
                                                        h3: ({ node, ...props }) => (
                                                            <h3 className="text-xl font-bold text-white mb-2 mt-4" {...props} />
                                                        ),
                                                        p: ({ node, ...props }) => (
                                                            <p className="text-gray-300 leading-relaxed mb-4" {...props} />
                                                        ),
                                                        ul: ({ node, ...props }) => (
                                                            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />
                                                        ),
                                                        ol: ({ node, ...props }) => (
                                                            <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />
                                                        ),
                                                        code: ({ node, inline, ...props }: any) =>
                                                            inline ? (
                                                                <code className="px-2 py-1 bg-gray-800 rounded text-blue-300 text-sm" {...props} />
                                                            ) : (
                                                                <code className="block p-4 bg-gray-800 rounded-lg text-sm overflow-x-auto" {...props} />
                                                            ),
                                                        blockquote: ({ node, ...props }) => (
                                                            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4" {...props} />
                                                        ),
                                                        a: ({ node, ...props }) => (
                                                            <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                                                        ),
                                                    }}
                                                >
                                                    {tabContent[activeTab]}
                                                </ReactMarkdown>
                                            ) : (
                                                <div className="text-center text-gray-500 py-12">
                                                    <p className="text-lg">이 섹션에는 아직 내용이 없습니다.</p>
                                                    <p className="text-sm mt-2">
                                                        Notion 페이지에서 &quot;{tabs.find(t => t.id === activeTab)?.label}&quot; 섹션을 추가해주세요.
                                                    </p>
                                                </div>
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
