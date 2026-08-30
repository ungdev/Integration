import { useEffect, useState } from 'react';

import { isTokenValid } from '../services/requests/auth.service';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                const data = await isTokenValid();
                if (data) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };
        verifyToken();
    }, []);
    return isAuthenticated;
};

export const checkUploadAvailability = async (url: string, callback?: () => void): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });

        if (response.ok) {
            callback?.();
            return true;
        }

        return false;
    } catch {
        return false;
    }
};

type CsvRow = Record<string, unknown>;

const escapeCsvValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }

    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    // CSV : on entoure de guillemets si nécessaire
    if (/[",\n\r]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
};

export const downloadJsonAsCsv = (data: CsvRow[], filename = 'export.csv'): void => {
    if (!data.length) {
        console.warn('Aucune donnée à exporter.');
        return;
    }

    const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));

    const csvRows = [
        headers.map(escapeCsvValue).join(','),
        ...data.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
    ];

    // BOM UTF-8 pour une bonne gestion des accents avec Excel (c'est copilot qui veut)
    const csv = `\uFEFF${csvRows.join('\r\n')}`;

    const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
