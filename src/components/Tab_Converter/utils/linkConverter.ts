// Tipos para enlaces procesados
export interface LinkInfo {
    url: string;
    filename: string;
    partNumber: number | null;
    fileSize?: string;
    service: 'mediafire' | 'mega' | 'other';
}

export interface ConversionResult {
    links: LinkInfo[];
    jsonOutput: string;
    arrayOutput: string[];
    summary: {
        total: number;
        mediafire: number;
        mega: number;
        hasParts: boolean;
        partsRange?: string;
        sorted: boolean;
    };
}

// Detección de servicios
const detectService = (url: string): 'mediafire' | 'mega' | 'other' => {
    if (url.includes('mediafire.com')) return 'mediafire';
    if (url.includes('mega.nz')) return 'mega';
    return 'other';
};

// Extraer información específica de MediaFire
const extractMediaFireInfo = (url: string): Partial<LinkInfo> => {
    const info: Partial<LinkInfo> = {
        service: 'mediafire'
    };

    // Extraer nombre de archivo
    const filenameMatch = url.match(/\/([^?]+\.(rar|zip|7z|part\d+\.[a-z0-9]+))(?:\?|$)/i);
    if (filenameMatch) {
        info.filename = filenameMatch[1];
    }

    // Extraer número de parte
    const partMatch = url.match(/\.part(\d+)\./i);
    if (partMatch) {
        info.partNumber = parseInt(partMatch[1], 10);
    }

    return info;
};

// Extraer información específica de MEGA
const extractMegaInfo = (url: string): Partial<LinkInfo> => {
    const info: Partial<LinkInfo> = {
        service: 'mega'
    };

    // Los enlaces MEGA suelen tener formato: https://mega.nz/file/XXXX#YYYY
    const fileIdMatch = url.match(/mega\.nz\/(file|folder)\/([^#?]+)/);
    if (fileIdMatch) {
        // Para MEGA, el "filename" no está en la URL, pero podemos usar el ID
        info.filename = `${fileIdMatch[1]}_${fileIdMatch[2].substring(0, 8)}`;
    }

    // Intentar extraer nombre si está en parámetros
    const nameMatch = url.match(/[?&]name=([^&]+)/);
    if (nameMatch) {
        info.filename = decodeURIComponent(nameMatch[1]);
    }

    return info;
};

// Función principal para procesar cualquier texto con enlaces
export const processDownloadLinks = (text: string): ConversionResult => {
    if (!text.trim()) {
        return {
            links: [],
            jsonOutput: '[]',
            arrayOutput: [],
            summary: {
                total: 0,
                mediafire: 0,
                mega: 0,
                hasParts: false,
                sorted: false
            }
        };
    }

    const lines = text.split('\n');
    const links: LinkInfo[] = [];

    lines.forEach(line => {
        const url = line.trim();
        if (!url.startsWith('http')) return;

        const service = detectService(url);
        const linkInfo: LinkInfo = {
            url,
            filename: url.split('/').pop()?.split('?')[0] || 'unknown',
            partNumber: null,
            service
        };

        // Extraer información específica del servicio
        if (service === 'mediafire') {
            Object.assign(linkInfo, extractMediaFireInfo(url));
        } else if (service === 'mega') {
            Object.assign(linkInfo, extractMegaInfo(url));
        }

        links.push(linkInfo);
    });

    // Ordenar enlaces
    const sortedLinks = [...links].sort((a, b) => {
        // Primero por servicio
        if (a.service !== b.service) {
            return a.service.localeCompare(b.service);
        }

        // Luego por número de parte si ambos tienen
        if (a.partNumber !== null && b.partNumber !== null) {
            return a.partNumber - b.partNumber;
        }

        // Finalmente alfabéticamente por URL
        return a.url.localeCompare(b.url);
    });

    // Contar por servicio
    const mediafireCount = sortedLinks.filter(l => l.service === 'mediafire').length;
    const megaCount = sortedLinks.filter(l => l.service === 'mega').length;

    // Verificar si hay partes numeradas
    const hasParts = sortedLinks.some(l => l.partNumber !== null);
    const parts = sortedLinks
        .filter(l => l.partNumber !== null)
        .map(l => l.partNumber as number)
        .sort((a, b) => a - b);

    const partsRange = parts.length > 0 ?
        `Partes ${Math.min(...parts)}-${Math.max(...parts)}` :
        undefined;

    // Crear outputs
    const jsonOutput = JSON.stringify(sortedLinks.map(l => l.url), null, 2);
    const arrayOutput = sortedLinks.map(l => l.url);

    return {
        links: sortedLinks,
        jsonOutput,
        arrayOutput,
        summary: {
            total: sortedLinks.length,
            mediafire: mediafireCount,
            mega: megaCount,
            hasParts,
            partsRange,
            sorted: true
        }
    };
};

// Función específica para MediaFire
export const processMediaFireLinks = (text: string): ConversionResult => {
    const result = processDownloadLinks(text);

    // Filtrar solo MediaFire
    const mediafireLinks = result.links.filter(l => l.service === 'mediafire');

    return {
        links: mediafireLinks,
        jsonOutput: JSON.stringify(mediafireLinks.map(l => l.url), null, 2),
        arrayOutput: mediafireLinks.map(l => l.url),
        summary: {
            total: mediafireLinks.length,
            mediafire: mediafireLinks.length,
            mega: 0,
            hasParts: mediafireLinks.some(l => l.partNumber !== null),
            sorted: true
        }
    };
};

// Función específica para MEGA
export const processMegaLinks = (text: string): ConversionResult => {
    const result = processDownloadLinks(text);

    // Filtrar solo MEGA
    const megaLinks = result.links.filter(l => l.service === 'mega');

    return {
        links: megaLinks,
        jsonOutput: JSON.stringify(megaLinks.map(l => l.url), null, 2),
        arrayOutput: megaLinks.map(l => l.url),
        summary: {
            total: megaLinks.length,
            mediafire: 0,
            mega: megaLinks.length,
            hasParts: false, // MEGA generalmente no usa partes
            sorted: true
        }
    };
};

// Función para convertir a diferentes formatos
export const convertToFormat = (
    links: string[],
    format: 'json' | 'array' | 'text' | 'html' | 'markdown'
): string => {
    switch (format) {
        case 'json':
            return JSON.stringify(links, null, 2);

        case 'array':
            return `[${links.map(link => `"${link}"`).join(', ')}]`;

        case 'text':
            return links.join('\n');

        case 'html':
            return links.map(link =>
                `<a href="${link}" target="_blank">${link}</a><br>`
            ).join('\n');

        case 'markdown':
            return links.map(link =>
                `- [${link}](${link})`
            ).join('\n');

        default:
            return JSON.stringify(links, null, 2);
    }
};

// Función para validar enlaces
export const validateLinks = (text: string): { valid: string[]; invalid: string[]; services: Record<string, number> } => {
    const lines = text.split('\n');
    const valid: string[] = [];
    const invalid: string[] = [];
    const services: Record<string, number> = {};

    lines.forEach(line => {
        const url = line.trim();

        if (!url) return;

        // Validación básica de URL
        const isValid = /^https?:\/\/[^\s]+$/.test(url) &&
            (url.includes('mediafire.com') || url.includes('mega.nz'));

        if (isValid) {
            valid.push(url);

            // Contar por servicio
            const service = detectService(url);
            services[service] = (services[service] || 0) + 1;
        } else {
            invalid.push(url);
        }
    });

    return { valid, invalid, services };
};

// Función para limpiar y normalizar texto
export const cleanTextInput = (text: string): string => {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
};

// Exportar todas las funciones
export default {
    processDownloadLinks,
    processMediaFireLinks,
    processMegaLinks,
    convertToFormat,
    validateLinks,
    cleanTextInput,
    detectService
};

// Función para convertir enlaces al formato específico
export const convertToCustomFormat = (text: string): Array<{ url: string; page: string }> => {
    if (!text.trim()) {
        return [];
    }

    const lines = text.split('\n');
    const result: Array<{ url: string; page: string }> = [];

    lines.forEach(line => {
        const url = line.trim();
        if (!url.startsWith('http')) return;

        let page: string;

        if (url.includes('mediafire.com')) {
            page = 'mediafire';
        } else if (url.includes('mega.nz')) {
            page = 'mega';
        } else {
            page = 'desconocida';
        }

        result.push({ url, page });
    });

    return result;
};

// Versión con JSON stringificado
export const convertToCustomFormatJSON = (text: string): string => {
    const data = convertToCustomFormat(text);
    return JSON.stringify(data, null, 2);
};

// Función para procesar y obtener múltiples formatos
export const processLinksToAllFormats = (text: string): { customFormat: Array<{ url: string; page: string }>; customFormatJSON: string; simpleArray: string[]; simpleJSON: string; summary: { total: number; mediafire: number; mega: number; unknown: number } } => {
    const customFormat = convertToCustomFormat(text);

    // Contar por página
    const mediafireCount = customFormat.filter(item => item.page === 'mediafire').length;
    const megaCount = customFormat.filter(item => item.page === 'mega').length;
    const unknownCount = customFormat.filter(item => item.page === 'desconocida').length;

    // Extraer solo URLs para otros formatos
    const urls = customFormat.map(item => item.url);

    return {
        customFormat,
        customFormatJSON: JSON.stringify(customFormat, null, 2),
        simpleArray: urls,
        simpleJSON: JSON.stringify(urls, null, 2),
        summary: {
            total: customFormat.length,
            mediafire: mediafireCount,
            mega: megaCount,
            unknown: unknownCount
        }
    };
};