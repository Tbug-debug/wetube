import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minlength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  //video는 하나의 유저만을 가지고 있다. 그래서 object를 이용하였다
  //'relationship'을 형성하기 위해서 Video schema에다가 User ObjectId를 넣었다.
});
//비디오의 모델을 mongodb에게 알려줌.

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
//정적 메소드로 import 없이도 Model.function()형태로 사용가능하게 만듬.

const Video = mongoose.model("Video", videoSchema);
export default Video;
