export interface Bank{
    bank_id: number;
    description: string;
    topic_id: number;
    available: boolean;
    time_limit: number;
    topic_name: string
}

export interface BankQuery {
    page: number;
    searchKeyword: string;
    subject_id?: number;
    topic_ids?: number;
    status?: "true" | "false" | "All";
}
