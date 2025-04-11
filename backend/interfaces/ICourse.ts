import IBase from "./IBase";

export  interface ICourseModel extends  IBase{
    name: string,
    description?: string,
}