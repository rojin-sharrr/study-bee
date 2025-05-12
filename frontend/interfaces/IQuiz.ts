// Setup the interface for the quiz; it should extend the IBase interface

import IBase from "@/interfaces/IBase";


export interface IQuestion {
    options: string[];
    question: string;
    answer_index: number;
    right_answer_reason: string;
}   

export interface IQuizzes extends IBase {
    highScore: number;
    questions: IQuestion[];
    name: string;
}   