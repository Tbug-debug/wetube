import express from "express";
import {
  watch,
  getEdit,
  upload,
  deleteVideo,
  postEdit,
} from "../controllers/videoController"; //default로 export를 하지 않았을때.

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

export default videoRouter;
