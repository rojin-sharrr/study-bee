import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./customBaseEntity";
import { IQuizModel } from "../interfaces/IQuiz";
import { IQuizQuestion } from "../interfaces/IQuiz";

@Entity("quizzes")
export default class Quiz extends CustomBaseEntity implements IQuizModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    name!: string;

    @Column({nullable: false})
    highScore!: number;

    @Column("jsonb", { nullable: false })
    questions!: IQuizQuestion[]; // This will store the array of IQuizQuestion objects

}
  