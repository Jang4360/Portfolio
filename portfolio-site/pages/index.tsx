import { GetStaticProps } from 'next';
import { useState } from 'react';
import { getProjects, getCareer, getSkills } from '@/lib/notion';
import { Hero } from '@/components/ui/hero';
import { ThreeDPhotoCarousel } from '@/components/ui/3d-carousel';
import { Timeline } from '@/components/ui/timeline';
import { DockTabs } from '@/components/ui/dock-tabs';
import ProjectModal from '@/components/ProjectModal';

interface Project {
    id: string;
    title: string;
    summary: string;
    coverImage: string;
    demoUrl: string;
    repoUrl: string;
    techStack: string[];
    category: string;
    summaryContent: string;
    features: string;
    troubleshooting: string;
}

interface CareerItem {
    id: string;
    title: string;
    category: string;
    date: string;
    organization: string;
    description: string;
}

interface CareerGroup {
    Education: CareerItem[];
    Certificate: CareerItem[];
    Award: CareerItem[];
}

interface Skill {
    id: string;
    name: string;
    proficiency: number;
    description: string;
    icon: string;
    category: string;
}

interface HomeProps {
    projects: Project[];
    career: CareerGroup;
    skills: Skill[];
}

export default function Home({ projects, career, skills }: HomeProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Timeline 데이터 변환
    const timelineData = Object.entries(career).flatMap(([category, items]) =>
        items.map((item: CareerItem) => ({
            title: item.date,
            content: (
                <div>
                    <div className="mb-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 font-medium inline-block">
                        {category}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400 mb-2">{item.organization}</p>
                    {item.description && (
                        <p className="text-gray-300 leading-relaxed">{item.description}</p>
                    )}
                </div>
            ),
        }))
    );

    // 프로젝트 이미지 추출 (3D Carousel용)
    const projectImages = projects.map((p) => p.coverImage || 'https://via.placeholder.com/400');

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section with Parallax */}
            <Hero
                backgroundImage="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop"
                title="JooyoonJang Portfolio"
                subtitle={["Flexible", "Challenge", "Together"]}
            />

            {/* Projects Section with 3D Carousel */}
            <section id="projects" className="min-h-screen py-20 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl md:text-7xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Projects
                    </h2>

                    {projects.length > 0 ? (
                        <ThreeDPhotoCarousel images={projectImages} />
                    ) : (
                        <div className="text-center text-gray-500 py-20">
                            <p className="text-xl">No projects yet. Add projects to your Notion database!</p>
                        </div>
                    )}

                    {/* Project Cards Grid (Fallback/Additional Display) */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
                            >
                                {project.coverImage && (
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={project.coverImage}
                                            alt={project.title}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                                    <p className="text-gray-400 mb-4 line-clamp-2">{project.summary}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <span className="px-3 py-1 text-sm text-gray-500">
                                                +{project.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Section with Timeline */}
            <section id="career" className="min-h-screen bg-black">
                {timelineData.length > 0 ? (
                    <Timeline data={timelineData} />
                ) : (
                    <div className="container mx-auto px-4 py-20 text-center">
                        <h2 className="text-5xl font-bold mb-12">Career</h2>
                        <p className="text-gray-500 text-xl">No career data yet. Add items to your Notion database!</p>
                    </div>
                )}
            </section>

            {/* Skills Section with Dock */}
            <section id="skills" className="min-h-screen py-20 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl md:text-7xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
                        Skills
                    </h2>

                    {skills.length > 0 ? (
                        <>
                            {/* Desktop: MacOS Dock Style */}
                            <div className="hidden md:block">
                                <DockTabs />
                            </div>

                            {/* Mobile: Grid Layout */}
                            <div className="md:hidden grid grid-cols-2 gap-6">
                                {skills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="bg-gray-900 p-6 rounded-lg text-center hover:bg-gray-800 transition-colors"
                                    >
                                        {skill.icon && (
                                            <img
                                                src={skill.icon}
                                                alt={skill.name}
                                                className="w-16 h-16 mx-auto mb-4 object-contain"
                                            />
                                        )}
                                        <h3 className="text-lg font-bold mb-2">{skill.name}</h3>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                                                style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">{skill.proficiency}/5</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-20">
                            <p className="text-xl">No skills yet. Add skills to your Notion database!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black border-t border-gray-800 py-12 text-center">
                <div className="space-x-8 mb-6">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-lg"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://tistory.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-lg"
                    >
                        Blog
                    </a>
                    <a
                        href="mailto:your@email.com"
                        className="text-gray-400 hover:text-white transition-colors text-lg"
                    >
                        Gmail
                    </a>
                </div>
                <p className="text-gray-600">© 2026 JooyoonJang. All rights reserved.</p>
            </footer>

            {/* Project Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}

// ============================================
// 🔄 ISR (Incremental Static Regeneration)
// ============================================

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    try {
        // Notion API에서 데이터 병렬 페칭
        const [projects, career, skills] = await Promise.all([
            getProjects(),
            getCareer(),
            getSkills(),
        ]);

        return {
            props: {
                projects,
                career,
                skills,
            },
            // 60초마다 재검증 (Incremental Static Regeneration)
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error fetching data:', error);

        // 에러 발생 시에도 빌드 실패하지 않도록 빈 데이터 반환
        return {
            props: {
                projects: [],
                career: {
                    Education: [],
                    Certificate: [],
                    Award: [],
                },
                skills: [],
            },
            revalidate: 60,
        };
    }
};
