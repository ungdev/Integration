export type NewsBody = {
    title: string;
    description: string;
    type: string;
    published?: boolean | string;
    target: string;
    image_url?: string | null;
    id?: number | string;
    sendEmail?: boolean;
};

export type NewsQuery = { type?: string; newsId?: string };
