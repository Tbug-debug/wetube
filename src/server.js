import express from "express"; //node_modules/express에서 express를 import함.
import morgan from "morgan";
import globalRouter from "./routers/globalRouters"; //default로 export를 하였을때.
import videoRouter from "./routers/videoRouters";
import userRouter from "./routers/userRouters";

const app = express();
/*app 변수를 만들어서, express 함수를 호출함.
이렇게 호출할 경우 express application을 바로 사용할 수 있게 return할 수 있음.*/
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
