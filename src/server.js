import express from "express"; //node_modules/express에서 express를 import함.
import morgan from "morgan";
import session from "express-session"; // express 세션을 호출함.
import MongoStore from "connect-mongo";
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
    secret: process.env.COOKIE_SECRET,
    //쿠키에 sign을 하여 우리가 backend가 쿠키를 줬다는 것을 보여주기 위하여 secret을 만든다.
    resave: false,
    saveUninitialized: false,
    /*세션을 형성함.
      세션 middeleware(백엔드)는 브라우저 쿠키에게 세션 ID를 전송함.
      백엔드에서는 세션에서 생성된 세션 ID를 보관하고 있다.
      resave : 모든 request마다 세션의 변경사항이 있든 없든 세션을 다시 저장한다.
      saveUninitialized : uninitialized 상태인 세션을 저장한다. 여기서 uninitialized 상태인 세션이란 request 때 생성된 이후로 아무런 작업이 가해지지않는 초기상태의 세션을 말한다.
      resave, saveUninitialized true일 경우, 방문 유저들 전부에게 session ID를 넘겨줌.
      resave, saveUninitialized false 일 경우, 로그인한 유저에게만 session ID를 넘겨줌.*/
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    //session 정보를 백엔드에 저장하는 역할을 함.
  })
);

app.use(localMiddleware); //pug engin과 세션 object는 호환이 안되므로 호환이 되는 local object를 만들음.
app.use("/uploads", express.static("uploads"));
// Express에게 /uploads/ 폴더의 내용을 보여주는 역할을 함. (이것은 AvatarUrl을 읽을 수 있게 함.)
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
