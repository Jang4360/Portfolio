import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: '2022-06-28',
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Helper to transform GitHub blob URLs to raw URLs
const transformGithubUrl = (url: string) => {
    if (!url) return '';
    // Fix known typo in Notion URLs: protfolio -> portfolio
    let fixed = url.replace('/protfolio/', '/portfolio/');
    if (fixed.includes('github.com') && fixed.includes('/blob/')) {
        return fixed.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return fixed;
};

// Helper to extract image URL from any Notion property type
const extractImageUrl = (prop: any): string => {
    if (!prop) return '';

    // URL type property
    if (prop.url) return prop.url;

    // Files type property
    if (prop.files && prop.files.length > 0) {
        const file = prop.files[0];
        if (file.type === 'file' && file.file?.url) return file.file.url;
        if (file.type === 'external' && file.external?.url) return file.external.url;
        if (file.file?.url) return file.file.url;
        if (file.external?.url) return file.external.url;
    }

    // Rich text type (URL stored as text)
    if (prop.rich_text && prop.rich_text.length > 0) {
        return prop.rich_text[0].plain_text || '';
    }

    return '';
};

// ============================================
// Project Database
// ============================================

export async function getProjects() {
    let databaseId = process.env.NOTION_PROJECT_DATABASE_ID!;
    // Format UUID if it's raw hex (32 chars)
    if (databaseId && databaseId.length === 32) {
        databaseId = `${databaseId.slice(0, 8)}-${databaseId.slice(8, 12)}-${databaseId.slice(12, 16)}-${databaseId.slice(16, 20)}-${databaseId.slice(20)}`;
    }

    const response = await notion.request({
        path: `databases/${databaseId}/query`,
        method: 'post',
    }) as any;

    const projects = await Promise.all(
        response.results.map(async (page: any) => {
            const pageContent = await getPageContent(page.id);

            // Extract title safely - Logs showed Name is 'rich_text', not 'title'
            let title = 'Untitled';
            if (page.properties.Name?.rich_text?.length > 0) {
                title = page.properties.Name.rich_text[0].plain_text;
            } else if (page.properties.Name?.title?.length > 0) {
                title = page.properties.Name.title[0].plain_text;
            }

            const coverUrl = extractImageUrl(page.properties.CoverImage);
            const archUrl = extractImageUrl(page.properties.ArchitectureImage);

            return {
                id: page.id,
                name: title,
                slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
                tagline: page.properties.Tagline?.rich_text?.[0]?.plain_text || '',
                period: page.properties.Period?.rich_text?.[0]?.plain_text || '',
                techStack: page.properties.TechStack?.multi_select?.map((tag: any) => tag.name) || [],
                role: page.properties.Role?.rich_text?.[0]?.plain_text || '',
                coverImage: transformGithubUrl(coverUrl),
                architectureImage: transformGithubUrl(archUrl),
                description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
                repoLink: page.properties.RepoLink?.url || null,
                ...pageContent,
            };
        })
    );

    return projects;
}

// ============================================
// Career Database
// ============================================

export async function getCareer() {
    let databaseId = process.env.NOTION_CAREER_DATABASE_ID!;
    if (databaseId && databaseId.length === 32) {
        databaseId = `${databaseId.slice(0, 8)}-${databaseId.slice(8, 12)}-${databaseId.slice(12, 16)}-${databaseId.slice(16, 20)}-${databaseId.slice(20)}`;
    }
    const response = await notion.request({
        path: `databases/${databaseId}/query`,
        method: 'post',
    }) as any;

    const career = response.results.map((page: any) => {
        // Try multiple strategies to get the title
        let titleText = 'Untitled';

        // Strategy 1: Look for "Title" property (rich_text or title type)
        if (page.properties.Title?.rich_text?.[0]?.plain_text) {
            titleText = page.properties.Title.rich_text[0].plain_text;
        } else if (page.properties.Title?.title?.[0]?.plain_text) {
            titleText = page.properties.Title.title[0].plain_text;
        }
        // Strategy 2: Look for any property of type "title" with content
        if (titleText === 'Untitled') {
            for (const key of Object.keys(page.properties)) {
                const prop = page.properties[key];
                if (prop.type === 'title' && prop.title?.length > 0) {
                    titleText = prop.title[0].plain_text;
                    break;
                }
            }
        }
        // Strategy 3: Look for "Name" property
        if (titleText === 'Untitled') {
            if (page.properties.Name?.rich_text?.[0]?.plain_text) {
                titleText = page.properties.Name.rich_text[0].plain_text;
            } else if (page.properties.Name?.title?.[0]?.plain_text) {
                titleText = page.properties.Name.title[0].plain_text;
            }
        }

        return {
        id: page.id,
        title: titleText,
        category: page.properties.Category?.select?.name || 'Other',
        date: page.properties.Date?.rich_text?.[0]?.plain_text
            || page.properties.Date?.date?.start
            || '',
        organization: page.properties.Organization?.rich_text?.[0]?.plain_text || '',
        description: page.properties.Description?.rich_text?.[0]?.plain_text
            || page.properties.Description?.title?.[0]?.plain_text
            || '',
    };
    });

    const grouped = {
        Education: career.filter((item: any) => item.category === 'Education'),
        Certificate: career.filter((item: any) => item.category === 'Certificate'),
        Award: career.filter((item: any) => item.category === 'Award'),
        Language: career.filter((item: any) => item.category === 'Language'),
    };

    return grouped;
}

// ============================================
// Skills Database
// ============================================

export async function getSkills() {
    let databaseId = process.env.NOTION_SKILLS_DATABASE_ID!;
    if (databaseId && databaseId.length === 32) {
        databaseId = `${databaseId.slice(0, 8)}-${databaseId.slice(8, 12)}-${databaseId.slice(12, 16)}-${databaseId.slice(16, 20)}-${databaseId.slice(20)}`;
    }
    const response = await notion.request({
        path: `databases/${databaseId}/query`,
        method: 'post',
    }) as any;

    const skills = response.results.map((page: any) => {
        // Find the title property dynamically
        let nameText = 'Untitled';
        for (const key of Object.keys(page.properties)) {
            const prop = page.properties[key];
            if (prop.type === 'title' && prop.title?.length > 0) {
                nameText = prop.title[0].plain_text;
                break;
            }
        }

        // Level: could be select with star emojis, number, or rich_text
        let level = 0;
        const levelProp = page.properties.Level || page.properties.Proficiency;
        if (levelProp?.select?.name) {
            // Count star emojis (⭐ or ★)
            const name = levelProp.select.name;
            level = (name.match(/⭐/g) || []).length || (name.match(/★/g) || []).length || parseInt(name) || 0;
        } else if (levelProp?.number != null) {
            level = levelProp.number;
        } else if (levelProp?.rich_text?.[0]?.plain_text) {
            const text = levelProp.rich_text[0].plain_text;
            level = (text.match(/⭐/g) || []).length || (text.match(/★/g) || []).length || parseInt(text) || 0;
        }

        // IconURL: try url type, then rich_text, then files
        const iconUrl = page.properties.IconURL?.url
            || page.properties.IconURL?.rich_text?.[0]?.plain_text
            || page.properties.Icon?.files?.[0]?.file?.url
            || page.properties.Icon?.files?.[0]?.external?.url
            || '';

        return {
            id: page.id,
            name: nameText,
            level,
            category: page.properties.Type?.select?.name
                || page.properties.Category?.select?.name
                || 'Other',
            detail: page.properties.Detail?.rich_text?.[0]?.plain_text
                || page.properties.Description?.rich_text?.[0]?.plain_text
                || '',
            iconUrl: transformGithubUrl(iconUrl),
        };
    });

    return skills;
}

// ============================================
// Block Parser (n2m)
// ============================================

export async function getPageContent(pageId: string) {
    try {
        const mdBlocks = await n2m.pageToMarkdown(pageId);

        let currentSection: 'features' | 'troubleshooting' | 'other' = 'other';

        const sections = {
            features: [] as any[],
            troubleshooting: [] as any[],
        };

        for (const block of mdBlocks) {
            // Check headers to switch sections
            if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
                const text = block.parent.trim().toLowerCase();
                if (text.includes('detailed features') || text.includes('상세 기능')) {
                    currentSection = 'features';
                    continue; // Skip the header itself if desired, or include it. 
                    // User wanted header content? "h1상세기능 안에 넘버링만 가져오고" 
                    // Let's include the header in the section so it looks complete, 
                    // or skip if we want just the list. 
                    // The user said "Detailed Feautres... content field inside page".
                    // Let's keep the header IN the section for context, but usually we just want content.
                    // Actually, the user's screenshot shows "상세 기능" as a header in the modal.
                    // So we should probably SKIP adding the header block to the bucket if we render our own header.
                } else if (text.includes('troubleshooting') || text.includes('트러블 슈팅')) {
                    currentSection = 'troubleshooting';
                    continue;
                }
            }

            if (currentSection === 'features') {
                sections.features.push(block);
            } else if (currentSection === 'troubleshooting') {
                sections.troubleshooting.push(block);
            }
        }

        const featuresMd = n2m.toMarkdownString(sections.features);
        const troubleshootingMd = n2m.toMarkdownString(sections.troubleshooting);

        return {
            summaryContent: '', // Not using summary from content anymore
            features: featuresMd.parent, // n2m returns object { parent: string }
            troubleshooting: troubleshootingMd.parent,
        };
    } catch (error) {
        console.error('Error parsing page content:', error);
        return {
            summaryContent: '',
            features: '',
            troubleshooting: '',
        };
    }
}

export default notion;
