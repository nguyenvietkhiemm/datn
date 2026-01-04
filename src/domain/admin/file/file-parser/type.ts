export type LatexMap = Record<string, string>;

export interface JsonAnswer {
    para_index?: number;
    text: string;
    math?: any[];
    images?: any[];
    latex?: LatexMap;  
    label?: string;
    is_correct: boolean;
}

export interface JsonQuestion {
    question: {
        para_index: number;
        text: string;
        type_question?: number;
        math: any[];
        images: any[];
        latex?: LatexMap; 
        label: string;
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

export type RemoveAnswerImageValue = {
    answerIndex: number;
    imageIndex: number;
};

export type AddAnswerImageValue = {
    answerIndex: number | undefined;
    imagePath: string;
};

export type ChangeAnswerValue = {
    answerIndex: number;
    value_change: string
}

export type ChangeValue =
    | string
    | number
    | boolean
    | null
    | File[]
    | RemoveAnswerImageValue
    | AddAnswerImageValue
    | ChangeAnswerValue