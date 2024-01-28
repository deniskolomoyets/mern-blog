import express from "express";

const app = express();

app.use(express.json()); //express shoud read json response

app.get("/", (req, res) => {
  res.send("Hello world wow ");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);
  res.json({
    success: true,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server start");
});
