import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// ============================================
// Project Database
// ============================================

export async function getProjects() {
    const databaseId = process.env.NOTION_PROJECT_DATABASE_ID!;

    const response = await notion.databases.query({
        database_id: databaseId,
    });

    const projects = await Promise.all(
        response.results.map(async (page: any) => {
            const pageContent = await getPageContent(page.id);

            return {
                id: page.id,
                name: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
                slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
                tagline: page.properties.Tagline?.rich_text?.[0]?.plain_text || '',
                period: page.properties.Period?.rich_text?.[0]?.plain_text || '',
                techStack: page.properties.TechStack?.multi_select?.map((tag: any) => tag.name) || [],
                role: page.properties.Role?.rich_text?.[0]?.plain_text || '',
                coverImage: page.properties.CoverImage?.url || '',
                architectureImage: page.properties.ArchitectureImage?.url || '',
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
    const databaseId = process.env.NOTION_CAREER_DATABASE_ID!;

    const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
            {
                property: 'Date',
                direction: 'descending',
            },
        ],
    });

    const career = response.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
        category: page.properties.Category?.select?.name || 'Other',
        date: page.properties.Date?.date?.start || '',
        organization: page.properties.Organization?.rich_text?.[0]?.plain_text || '',
        description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
    }));

    const grouped = {
        Education: career.filter(item => item.category === 'Education'),
        Certificate: career.filter(item => item.category === 'Certificate'),
        Award: career.filter(item => item.category === 'Award'),
    };

    return grouped;
}

// ============================================
// Skills Database
// ============================================

export async function getSkills() {
    const databaseId = process.env.NOTION_SKILLS_DATABASE_ID!;

    const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
            {
                property: 'Order',
                direction: 'ascending',
            },
        ],
    });

    const skills = response.results.map((page: any) => ({
        id: page.id,
        name: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
        proficiency: page.properties.Proficiency?.number || 3,
        description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
        icon: page.properties.Icon?.files?.[0]?.file?.url || page.properties.Icon?.files?.[0]?.external?.url || '',
        category: page.properties.Category?.select?.name || 'Other',
    }));

    return skills;
}

// ============================================
// Block Parser
// ============================================

export async function getPageContent(pageId: string) {
    try {
        const blocks = await notion.blocks.children.list({
            block_id: pageId,
            page_size: 100,
        });

        let currentSection: 'summary' | 'features' | 'troubleshooting' = 'summary';

        const sections = {
            summary: [] as any[],
            features: [] as any[],
            troubleshooting: [] as any[],
        };

        for (const block of blocks.results) {
            const blockData = block as any;

            if (blockData.type === 'heading_1') {
                const headingText = blockData.heading_1?.rich_text?.[0]?.plain_text || '';

                if (
                    headingText.toLowerCase().includes('detailed features') ||
                    headingText.includes('상세 기능')
                ) {
                    currentSection = 'features';
                    continue;
                } else if (
                    headingText.toLowerCase().includes('troubleshooting') ||
                    headingText.includes('트러블 슈팅')
                ) {
                    currentSection = 'troubleshooting';
                    continue;
                }
            }

            sections[currentSection].push(blockData);
        }

        const summaryMd = await convertBlocksToMarkdown(sections.summary);
        const featuresMd = await convertBlocksToMarkdown(sections.features);
        const troubleshootingMd = await convertBlocksToMarkdown(sections.troubleshooting);

        return {
            summaryContent: summaryMd,
            features: featuresMd,
            troubleshooting: troubleshootingMd,
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

async function convertBlocksToMarkdown(blocks: any[]): Promise<string> {
    if (blocks.length === 0) return '';

    try {
        const markdownBlocks = await Promise.all(
            blocks.map(async (block) => {
                return await blockToMarkdown(block);
            })
        );

        return markdownBlocks.filter(Boolean).join('\n\n');
    } catch (error) {
        console.error('Error converting blocks to markdown:', error);
        return '';
    }
}

async function blockToMarkdown(block: any): Promise<string> {
    const type = block.type;

    try {
        switch (type) {
            case 'paragraph':
                return richTextToPlainText(block.paragraph.rich_text);
            case 'heading_1':
                return `# ${richTextToPlainText(block.heading_1.rich_text)}`;
            case 'heading_2':
                return `## ${richTextToPlainText(block.heading_2.rich_text)}`;
            case 'heading_3':
                return `### ${richTextToPlainText(block.heading_3.rich_text)}`;
            case 'bulleted_list_item':
                return `- ${richTextToPlainText(block.bulleted_list_item.rich_text)}`;
            case 'numbered_list_item':
                return `1. ${richTextToPlainText(block.numbered_list_item.rich_text)}`;
            case 'code':
                const code = richTextToPlainText(block.code.rich_text);
                const language = block.code.language || '';
                return `\`\`\`${language}\n${code}\n\`\`\``;
            case 'quote':
                return `> ${richTextToPlainText(block.quote.rich_text)}`;
            case 'callout':
                return richTextToPlainText(block.callout.rich_text);
            case 'divider':
                return '---';
            default:
                return '';
        }
    } catch (error) {
        console.error(`Error converting block type ${type}:`, error);
        return '';
    }
}

function richTextToPlainText(richText: any[]): string {
    if (!richText || richText.length === 0) return '';

    return richText
        .map((text) => {
            let plainText = text.plain_text;

            if (text.annotations?.bold) plainText = `**${plainText}**`;
            if (text.annotations?.italic) plainText = `*${plainText}*`;
            if (text.annotations?.code) plainText = `\`${plainText}\``;
            if (text.href) plainText = `[${plainText}](${text.href})`;

            return plainText;
        })
        .join('');
}

export default notion;
