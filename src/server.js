import express from "express"; //node_modules/express에서 express를 import함.
import morgan from "morgan";
import session from "express-session"; // express 세션을 호출함.
import rootRouter from "./routers/rootRouter"; //default로 export를 하였을때.
import videoRouter from "./routers/videoRouters";
import userRouter from "./routers/userRouters";
import { localMiddleware } from "./middlewares";

const app = express();
/*app 변수를 만들어서, express 함수를 호출함.
이렇게 호출할 경우 express application을 바로 사용할 수 있게 return할 수 있음.*/
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
    //세션을 형성함.
    //세션 middeleware(백엔드)는 브라우저 쿠키에게 세션 ID를 전송함.
    //백엔드에서는 세션에서 생성된 세션 ID를 보관하고 있다.
  })
);

app.use(localMiddleware); //pug engin과 세션 object는 호환이 안되므로 호환이 되는 local을 만들음.
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
