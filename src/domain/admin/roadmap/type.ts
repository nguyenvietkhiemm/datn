export interface RoadmapStep {
    roadmap_step_id: number;
    title: string;
    description: string;
    topic_id: number;
    topic_name: string;
}

export interface Topic {
    topic_id: number;
    title: string;
    description?: string;
    subject_id?: number | null;
    created_at: string;
}