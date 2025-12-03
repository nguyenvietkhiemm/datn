export interface JsonAnswer {
    para_index: number;
    text: string;
    math: any[];
    media: any[]; // images
    label: string;
}

export interface JsonQuestion {
    question: {
        para_index: number;
        text: string;
        math: any[];
        media: any[]; // images
        label: string;
    };
    answers: JsonAnswer[];
}