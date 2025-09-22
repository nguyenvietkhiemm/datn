export interface Document {
    document_id: number;
    title: string;
    link: string;
    embedding: number[];
    created_at: Date;
    topic_id: number;
}
