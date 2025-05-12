import IBase from "./IBase";

export interface IQuizQuestion {
    question: string;
    options: string[];
    answer_index: number;
    right_answer_reason: string;
}

export interface IQuizModel extends IBase {
    highScore: number;
    questions: IQuizQuestion[];
}

export interface IQuizCourseAssetsModel extends IBase {
    quizId: string;
    courseId: string;
    assetIds: string[];
}