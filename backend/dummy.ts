import { EntityUser } from "./entities";

const abc = async () => {
  EntityUser.create({
    name: "nishan",
    password: "asdasd",
    email: "thaod",
  }).save();
};

export { abc };
