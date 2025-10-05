import { BankQuestion } from "./bank.question.model";

export interface Bank {
    bank_id: number;
    description: string;
    topic_id: number;
    questions?: BankQuestion[];
    available: boolean;
}