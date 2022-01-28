import express from "express";

const PORT = 4000;

const app = express();

const serverListening = () =>
  console.log(`Sever listening on port http://localhost:${PORT}`);

app.listen(PORT, serverListening);
