import express from "express"; //node_modules/express에서 express를 import함.

const PORT = 4000; // port 4000번을 호출함.

const app = express();
/*app 변수를 만들어서, express 함수를 호출함.
이렇게 호출할 경우 express application을 바로 사용할 수 있게 return할 수 있음.*/

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const handleHome = (req, res) => {
  /*controller에는 req(request)와 res(respond)와 next라는 argument가 있다.
  위의 req와 res는 express에서 기본적으로 제공해주는 것이다.*/
  return res.send("Fuck you middleware");
  //브라우저가 request한 것을 respond로 받아주고 있다.
};

app.get("/", logger, handleHome); //브라우저가 request한 것을 get으로 받음.

const serverListening = () =>
  console.log(`Sever listening on port http://localhost:${PORT}`);

app.listen(PORT, serverListening); //express에서 400번 포트로 서버를 Listen하고 있음.
