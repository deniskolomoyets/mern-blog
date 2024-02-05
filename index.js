import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://kolomoetc:wwwwww@cluster0.muaios8.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads"); //file path
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname); //file name
  },
});

const upload = multer({ storage });

app.use(express.json()); //express shoud read json response
app.use(cors());
app.use("/uploads", express.static("uploads")); //get request to retrieve a static file

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
}); //single-middleware multer.

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll); //receiving all articles
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne); //receiving one article
app.post(
  "/posts",
  checkAuth,
  handleValidationErrors,
  postCreateValidation,
  PostController.create
); //create post
app.delete("/posts/:id", checkAuth, PostController.remove); //delete post
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  postCreateValidation,
  PostController.update
); //update post

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server start");
});
