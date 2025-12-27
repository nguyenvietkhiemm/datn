export interface Topic {
    topic_id: number;
    title: string;
    description?: string;
    subject_id?: number | undefined;
    created_at: string;
}

export type Subject = {
    subject_id: number;
    subject_name: string;
    subject_type: number
}

export interface ValidationRules {
    title?: boolean;
    description?: boolean;
    subject?: boolean;
}