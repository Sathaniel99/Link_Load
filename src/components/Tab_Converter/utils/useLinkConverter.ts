// Hooks
import { useState, useCallback } from 'react';
// Schemas
import * as converter from './linkConverter';

export const useLinkConverter = () => {
    const [result, setResult] = useState<converter.ConversionResult | null>(null);
    const [customResult, setCustomResult] = useState<ReturnType<typeof converter.processLinksToAllFormats> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processText = useCallback((text: string, service?: 'all' | 'mediafire' | 'mega' | 'custom') => {
        setLoading(true);
        setError(null);
        
        try {
            if (service === 'custom') {
                const processedResult = converter.processLinksToAllFormats(text);
                setCustomResult(processedResult);
                setResult(null);
                return processedResult;
            } else {
                let processedResult: converter.ConversionResult;
                
                switch (service) {
                    case 'mediafire':
                        processedResult = converter.processMediaFireLinks(text);
                        break;
                    case 'mega':
                        processedResult = converter.processMegaLinks(text);
                        break;
                    default:
                        processedResult = converter.processDownloadLinks(text);
                }
                
                setResult(processedResult);
                setCustomResult(null);
                return processedResult;
            }
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Nuevas funciones para el formato custom
    const getCustomFormat = useCallback((text: string) => {
        return converter.convertToCustomFormat(text);
    }, []);

    const getCustomFormatJSON = useCallback((text: string) => {
        return converter.convertToCustomFormatJSON(text);
    }, []);

    const convertToFormat = useCallback((format: 'json' | 'array' | 'text' | 'html' | 'markdown' | 'custom') => {
        if (!result && !customResult) return '';
        
        if (format === 'custom') {
            return customResult?.customFormatJSON || '[]';
        }
        
        const links = result?.arrayOutput || customResult?.simpleArray || [];
        return converter.convertToFormat(links, format);
    }, [result, customResult]);

    const validate = useCallback((text: string) => {
        return converter.validateLinks(text);
    }, []);

    const cleanText = useCallback((text: string) => {
        return converter.cleanTextInput(text);
    }, []);

    const reset = useCallback(() => {
        setResult(null);
        setCustomResult(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        result,
        customResult,
        loading,
        error,
        processText,
        getCustomFormat,
        getCustomFormatJSON,
        convertToFormat,
        validate,
        cleanText,
        reset
    };
};