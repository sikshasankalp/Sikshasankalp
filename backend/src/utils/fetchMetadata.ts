import { URL } from 'url';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

function isPrivateIP(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) return false;
    
    // 10.0.0.0 - 10.255.255.255
    if (parts[0] === 10) return true;
    
    // 172.16.0.0 - 172.31.255.255
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    
    // 192.168.0.0 - 192.168.255.255
    if (parts[0] === 192 && parts[1] === 168) return true;
    
    // 127.0.0.0 - 127.255.255.255
    if (parts[0] === 127) return true;
    
    // 169.254.0.0 - 169.254.255.255 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    
    return false;
}

export interface ArticleMetadata {
    title?: string;
    publication?: string;
    description?: string;
    thumbnailUrl?: string;
}

function extractMeta(html: string, nameOrProperty: string): string | undefined {
    const regex = new RegExp(`<meta[^>]+(?:name|property)=["']${nameOrProperty}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
    const match = html.match(regex);
    if (match) return match[1];
    
    // reverse order (content before name/property)
    const regex2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:name|property)=["']${nameOrProperty}["'][^>]*>`, 'i');
    const match2 = html.match(regex2);
    if (match2) return match2[1];

    return undefined;
}

export async function fetchArticleMetadata(targetUrl: string): Promise<ArticleMetadata> {
    try {
        const url = new URL(targetUrl);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new Error('Invalid protocol');
        }

        // SSRF protection
        const address = await lookup(url.hostname);
        if (isPrivateIP(address.address)) {
            throw new Error('SSRF Protection: Private IP address detected');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 5000); // 5 seconds timeout

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            signal: controller.signal,
            redirect: 'manual'
        });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        // Limit size to prevent memory exhaustion (max 1MB)
        const text = await response.text();
        const html = text.substring(0, 1024 * 1024);

        const title = extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title') || html.match(/<title>([^<]+)<\/title>/i)?.[1];
        const publication = extractMeta(html, 'og:site_name') || url.hostname;
        const description = extractMeta(html, 'og:description') || extractMeta(html, 'twitter:description') || extractMeta(html, 'description');
        const thumbnailUrl = extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image');

        return {
            title: title ? decodeHTMLEntities(title.trim()) : undefined,
            publication: publication ? decodeHTMLEntities(publication.trim()) : undefined,
            description: description ? decodeHTMLEntities(description.trim()) : undefined,
            thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : undefined,
        };
    } catch (error) {
        console.error('Metadata fetch error:', error);
        return {};
    }
}

function decodeHTMLEntities(text: string): string {
    return text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
               .replace(/&quot;/g, '"')
               .replace(/&apos;/g, "'")
               .replace(/&amp;/g, "&")
               .replace(/&lt;/g, "<")
               .replace(/&gt;/g, ">");
}
