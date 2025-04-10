import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./user";

@Entity("courses")
export default class Course {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  // Adding Cols
  @Column({ nullable: false })
  name: string;

  @Column()
  description?: string;

  @ManyToOne(() => User, (user) => user.courses)
  creator: User;

  constructor(name: string, description: string, creator: User) {
    this.name = name;
    this.description = description;
    this.creator = creator;
  }
}
