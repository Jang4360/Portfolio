import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// Notion 클라이언트 초기화
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// ============================================
// 📊 Database 조회 함수들
// ============================================

/**
 * 프로젝트 데이터베이스 조회
 */
export async function getProjects() {
    const databaseId = process.env.NOTION_PROJECT_DATABASE_ID!;

    const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
            {
                property: 'Order',
                direction: 'ascending',
            },
        ],
    });

    const projects = await Promise.all(
        response.results.map(async (page: any) => {
            const pageContent = await getPageContent(page.id);

            return {
                id: page.id,
                title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
                summary: page.properties.Summary?.rich_text?.[0]?.plain_text || '',
                coverImage: page.properties.Cover?.files?.[0]?.file?.url || page.properties.Cover?.files?.[0]?.external?.url || '',
                demoUrl: page.properties.DemoURL?.url || '',
                repoUrl: page.properties.RepoURL?.url || '',
                techStack: page.properties.TechStack?.multi_select?.map((tag: any) => tag.name) || [],
                category: page.properties.Category?.select?.name || 'Project',
                ...pageContent, // features, troubleshooting, summary
            };
        })
    );

    return projects;
}

/**
 * 경력 데이터베이스 조회 (Education, Awards, Certificates)
 */
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

    // 카테고리별로 그룹화
    const grouped = {
        Education: career.filter(item => item.category === 'Education'),
        Certificate: career.filter(item => item.category === 'Certificate'),
        Award: career.filter(item => item.category === 'Award'),
    };

    return grouped;
}

/**
 * 스킬 데이터베이스 조회
 */
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
// 🔍 Block Parser - 핵심 로직
// ============================================

/**
 * Notion 페이지의 블록들을 파싱하여 섹션별로 분리
 * 
 * 로직:
 * 1. 페이지의 모든 블록을 가져옴
 * 2. heading_1 블록을 기준으로 섹션 구분
 * 3. "Detailed Features" (또는 "상세 기능") → features 배열
 * 4. "Troubleshooting" (또는 "트러블 슈팅") → troubleshooting 배열
 * 5. 나머지 → summary에 포함
 */
export async function getPageContent(pageId: string) {
    try {
        // 페이지의 모든 블록 가져오기
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

        // 블록들을 순회하며 섹션별로 분류
        for (const block of blocks.results) {
            const blockData = block as any;

            // heading_1 블록을 만나면 섹션 전환
            if (blockData.type === 'heading_1') {
                const headingText = blockData.heading_1?.rich_text?.[0]?.plain_text || '';

                if (
                    headingText.toLowerCase().includes('detailed features') ||
                    headingText.includes('상세 기능')
                ) {
                    currentSection = 'features';
                    continue; // 헤딩 자체는 추가하지 않음
                } else if (
                    headingText.toLowerCase().includes('troubleshooting') ||
                    headingText.includes('트러블 슈팅')
                ) {
                    currentSection = 'troubleshooting';
                    continue;
                }
            }

            // 현재 섹션에 블록 추가
            sections[currentSection].push(blockData);
        }

        // 블록들을 마크다운으로 변환
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

/**
 * Notion 블록들을 마크다운 텍스트로 변환
 */
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

/**
 * 개별 블록을 마크다운으로 변환
 */
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
                return `💡 ${richTextToPlainText(block.callout.rich_text)}`;

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

/**
 * Rich Text를 Plain Text로 변환
 */
function richTextToPlainText(richText: any[]): string {
    if (!richText || richText.length === 0) return '';

    return richText
        .map((text) => {
            let plainText = text.plain_text;

            // 스타일 적용
            if (text.annotations?.bold) plainText = `**${plainText}**`;
            if (text.annotations?.italic) plainText = `*${plainText}*`;
            if (text.annotations?.code) plainText = `\`${plainText}\``;
            if (text.href) plainText = `[${plainText}](${text.href})`;

            return plainText;
        })
        .join('');
}

// ============================================
// 🚀 Exports
// ============================================

export default notion;
