import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const handleHome = (req, res) => {
  return res.send("Fuck you middleware");
};

app.get("/", logger, handleHome);

const serverListening = () =>
  console.log(`Sever listening on port http://localhost:${PORT}`);

app.listen(PORT, serverListening);
