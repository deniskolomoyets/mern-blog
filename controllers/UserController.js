import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); //password encryption algorithm
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save(); //save the result that Mongodb sends (in const user)

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123", //second param, with this key I'll encrypt _id token
      {
        expiresIn: "30d", //how long token can live
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token }); //want to return user and token information
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123", //second param, with this key I'll encrypt _id token
      {
        expiresIn: "30d", //how long token can live
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to log in",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json({ userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "No access",
    });
  }
};
