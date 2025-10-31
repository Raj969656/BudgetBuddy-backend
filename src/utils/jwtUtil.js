import jsonwebtoken from "jsonwebtoken";
import { ACCESS_SECRET, ACCESS_TOKEN_EXP } from "./constants.js";

export const createToken = (user, token_type = "access_token") => {
  return jsonwebtoken.sign(
    {
      email: user.email,
      username: user.username,
      sub: user._id,
      token_type,
    },
    ACCESS_SECRET || process.env.JWT_SECRET || "secretkey",
    {
      expiresIn: ACCESS_TOKEN_EXP || "7d",
    }
  );
};
