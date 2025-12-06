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

export type Change = {
    row: number;
    col: number;
    value: string;
};

export interface Params {
    [key: string]: string;
    name: string;
}