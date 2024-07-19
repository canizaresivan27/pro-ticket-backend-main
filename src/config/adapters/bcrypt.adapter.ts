import { compareSync, genSalt, genSaltSync, hashSync } from "bcryptjs";

export const encryptAdapter = {
  hash: (password: string) => {
    const salt = genSaltSync();
    return hashSync(password, salt);
  },

  compare: (password: string, hashed: string) => {
    return compareSync(password, hashed);
  },
};
