import IBase from "./IBase";

export interface IUserModel extends IBase {
  name: string;
  email: string;
  username: string;
  password: string;
  courses: any[]
}
