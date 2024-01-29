import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://kolomoetc:wwwwww@cluster0.muaios8.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json()); //express shoud read json response

app.post("/auth/register", (req, res) => {});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server start");
});
