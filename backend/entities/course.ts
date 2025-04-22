import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./user";
import { ICourseModel } from "../interfaces";
import { CustomBaseEntity } from "./customBaseEntity";

@Entity("courses")
export default class Course extends CustomBaseEntity implements ICourseModel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Adding Cols
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  description?: string;


  @ManyToOne(() => User, (user) => user.courses)
  creator!: User;

  // @ManyToOne(() => User, (user) => user.courses)
  // creator: User;

  // constructor(name: string, description: string) {
  //   super();
  //   this.name = name;
  //   this.description = description;
  //   // this.creator = creator;
  // }
}
