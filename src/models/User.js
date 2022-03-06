import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  //user는 video를 만들고 싶은 만큼 만들수 있다. 그것을 이용해서 video arrey를 만들었다.
  //'relationship'을 형성하기 위해서 User schema에다가 Video ObjectId를 넣었다.
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    //upload 하여 save할때마다 hash값이 한번더 해쉬가 되어 유저가 이전 계정으로 들어가지 못하는 문제를 해결하였다.
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
