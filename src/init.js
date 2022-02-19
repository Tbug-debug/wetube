import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000; // port 4000번을 호출함.

const serverListening = () =>
  console.log(`Sever listening on port http://localhost:${PORT}`);

app.listen(PORT, serverListening); //express에서 400번 포트로 서버를 Listen하고 있음.
