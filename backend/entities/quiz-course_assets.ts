import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./customBaseEntity";
import { IQuizCourseAssetsModel } from "../interfaces/IQuiz";

@Entity("quiz-course-assets")
export default class quiz_course_assets extends CustomBaseEntity implements IQuizCourseAssetsModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    quizId!: string;

    @Column({nullable: false})
    courseId!: string;

    @Column("text", { array: true, nullable: false })
    assetIds!: string[];

}
  