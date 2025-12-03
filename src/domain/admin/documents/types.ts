export type Document = {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number;
    available: boolean;
    topic_title: string
};

export type Topic = {
    topic_id: number;
    title: string;
    subject_id?: number;
};

export type Subject = {
    subject_id: number;
    subject_name: string;
};
