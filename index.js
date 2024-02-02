import express from "express";

import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://kolomoetc:wwwwww@cluster0.muaios8.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json()); //express shoud read json response

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll); //receiving all articles
app.get("/posts/:id", PostController.getOne); //receiving one article
app.post("/posts", checkAuth, postCreateValidation, PostController.create); //create post
app.delete("/posts/:id", checkAuth, PostController.remove); //delete post
app.patch("/posts/:id", checkAuth, PostController.update); //update post

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server start");
});
