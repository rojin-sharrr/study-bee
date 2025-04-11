import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { CustomBaseEntity } from "./customBaseEntity";
import { IAsset_CourseModel } from "../interfaces";

@Entity("asset-course")
@Unique(["asset_id", "course_id"]) // Unique Decorator makes sure the columns asset_id and course_id are unique.
export default class asset_course extends CustomBaseEntity implements IAsset_CourseModel {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    course_id!: string;

    @Column({nullable: false})
    asset_id!: string;
}
