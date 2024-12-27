import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// REGISTER FUNCTION //
export const register = async (req, res, next) => {
  const { username, email, phonenumber, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "Vui lòng điền đầy đủ các ô!!!"));
  }
  // HASH PASSWORD
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("Register successful");
  } catch (error) {
    next(error);
  }
};

// LOGIN FUNCTION //
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "Vui lòng điền đầy đủ các ô!!!"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Người dùng không tồn tại"));
    }

    // Kiểm tra nếu người dùng bị khóa
    if (validUser.isBlocked) {
      return next(errorHandler(403, "Tài khoản của bạn đã bị khóa"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Sai mật khẩu!"));
    }

    const token = jwt.sign(
      { userId: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// LOGIN & REGISTER WITH GOOGLE //
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Kiểm tra nếu người dùng bị khóa
      if (user.isBlocked) {
        return next(errorHandler(403, "Tài khoản của bạn đã bị khóa"));
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
