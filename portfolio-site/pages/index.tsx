import { GetStaticProps } from 'next';
import { useState } from 'react';
import { getProjects, getCareer, getSkills } from '@/lib/notion';
import FullScreenPortfolio from '@/components/FullScreenPortfolio';
import ProjectModal from '@/components/ProjectModal';
import IntroContent from '@/components/sections/IntroContent';
import ProjectsContent from '@/components/sections/ProjectsContent';
import CareerContent from '@/components/sections/CareerContent';
import SkillsContent from '@/components/sections/SkillsContent';

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
    Language: CareerItem[];
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

    const sections = [
        {
            id: 'intro',
            label: 'INTRO',
            bgImage: '/images/background/intro.jpg',
            content: <IntroContent />,
        },
        {
            id: 'projects',
            label: 'PROJECTS',
            bgImage: '/images/background/projects.jpg',
            content: (
                <ProjectsContent
                    projects={projects}
                    onProjectClick={(p) => setSelectedProject(p)}
                />
            ),
        },
        {
            id: 'career',
            label: 'CAREER',
            bgImage: '/images/background/career.jpg',
            content: <CareerContent career={career} isActive={true} />,
        },
        {
            id: 'skills',
            label: 'SKILLS',
            bgImage: '/images/background/skills.jpg',
            content: <SkillsContent />,
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <FullScreenPortfolio sections={sections} />

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

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const emptyCareer = { Education: [], Certificate: [], Award: [], Language: [] };

    const [projects, career, skills] = await Promise.all([
        getProjects().catch((e) => { console.error('Projects fetch error:', e.message); return []; }),
        getCareer().catch((e) => { console.error('Career fetch error:', e.message); return emptyCareer; }),
        getSkills().catch((e) => { console.error('Skills fetch error:', e.message); return []; }),
    ]);

    return {
        props: { projects, career, skills },
        revalidate: 60,
    };
};
