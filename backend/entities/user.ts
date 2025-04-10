import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import Course from "./courses";
import { CustomBaseEntity } from "./customBaseEntity";
import { IUserModel } from "../interfaces";

@Entity("users")
export default class User extends CustomBaseEntity implements IUserModel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @OneToMany(() => Course, (course) => course.creator)
  courses!: Course[];

  // Check if the emails exists before email is sent
  @BeforeInsert()
  async checkEmail() {
    // validate email
    const isValid = true;
    if (!isValid) {
      throw new Error("Not a valid email");
    }
  }
}
