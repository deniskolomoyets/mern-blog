import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json()); //express shoud read json response

app.get("/", (req, res) => {
  res.send("Hello world wow ");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);

  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "Sara Konor",
    },
    "secret123"
  ); //encrypt object (with a special key )

  res.json({
    success: true,
    token,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server start");
});
