export interface JsonAnswer {
    para_index?: number;
    text: string;
    math?: any[];
    images?: any[]; // images
    label?: string;
    is_correct : boolean
}

export interface JsonQuestion {
    question: {
        para_index: number;
        text: string;
        type_question?: number;
        math: any[];
        images: any[]; // images
        label: string;
        newImages?: File[];
    };
    answers: JsonAnswer[];
}

export type Change = {
    row: number;
    col: number;
    value: string | number | boolean | null
};

export interface Params {
    [key: string]: string;
    name: string;
}