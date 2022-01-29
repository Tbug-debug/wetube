import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
  return res.send("Fuck you");
};

const handleLogin = (req, res) => {
  return res.send("Fuck you login");
};

app.get("/", handleHome);
app.get("/login", handleLogin);
const serverListening = () =>
  console.log(`Sever listening on port http://localhost:${PORT}`);

app.listen(PORT, serverListening);
