import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController"; //default로 export를 하지 않았을때.

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", see);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
