export type Document = {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number;
    available: boolean;
    topic_title: string
};

export interface DocumnetQuery{
    page: number;
    searchKeyword: string;
    subject_id?: number;
    topic_ids?: number;
    status?: "true" | "false" | "All";
}


