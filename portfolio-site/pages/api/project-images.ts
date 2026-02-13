import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    notionVersion: '2022-06-28',
});

const transformGithubUrl = (url: string) => {
    if (!url) return '';
    // Fix known typo in Notion URLs: protfolio -> portfolio
    let fixed = url.replace('/protfolio/', '/portfolio/');
    if (fixed.includes('github.com') && fixed.includes('/blob/')) {
        return fixed.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return fixed;
};

const extractImageUrl = (prop: any): string => {
    if (!prop) return '';

    // URL type property
    if (prop.url) return prop.url;

    // Files type property
    if (prop.files && prop.files.length > 0) {
        const file = prop.files[0];
        // Notion-hosted file
        if (file.type === 'file' && file.file?.url) return file.file.url;
        // External file
        if (file.type === 'external' && file.external?.url) return file.external.url;
        // Fallback
        if (file.file?.url) return file.file.url;
        if (file.external?.url) return file.external.url;
    }

    // Rich text type (URL stored as text)
    if (prop.rich_text && prop.rich_text.length > 0) {
        return prop.rich_text[0].plain_text || '';
    }

    return '';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { pageId } = req.query;
    if (!pageId || typeof pageId !== 'string') {
        return res.status(400).json({ error: 'pageId is required' });
    }

    try {
        const page = await notion.pages.retrieve({ page_id: pageId }) as any;

        const coverUrl = extractImageUrl(page.properties.CoverImage);
        const archUrl = extractImageUrl(page.properties.ArchitectureImage);

        // No cache - always fetch fresh URLs from Notion
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(200).json({
            coverImage: transformGithubUrl(coverUrl),
            architectureImage: transformGithubUrl(archUrl),
        });
    } catch (error: any) {
        console.error('Failed to fetch project images:', error.message);
        return res.status(500).json({ error: 'Failed to fetch images' });
    }
}
