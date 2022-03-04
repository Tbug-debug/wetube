import Video from "../models/Video";
import User from "../models/User";

/*Video.find({}, (error, videos) => {
  return res.render("home", {pageTitle: "Home", videos});
});
callback 구 버전
*/

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};
//promise 신버전

export const watch = async (req, res) => {
  const { id } = req.params;
  //const id  = req.params.id: 구버전 JavaScript / 위에 것은 ES6 버전.
  const video = await Video.findById(id).populate("owner");
  /*방법 2. populate를 하게 되면 mongoose가 Video model에서 ref:"User"를 참고하여,
    User에 있는 정보들을 불러와 준다.*/
  //const owner = await User.findById(video.owner)
  // 방법 1.
  if (!video) {
    return res.render("404", { pageTitle: "404 Video not foun" });
  }
  return res.render("watch", { pageTitle: video.title, video /*owner*/ });
};

export const getEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const video = await Video.findById(id);
  //findById 사용 이유: objec를 edit template으로 보내줘야 하기 때문에 findById가 적헙하다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not foun" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById({ _id: id });
  //Video의 object 대신 true false를 받는다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not foun" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    //findByIdAndUpdate는 id 값을 인자로 받는다.
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("succes", "Changes saved");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    //이곳에서 1차적으로 video에 owner_id를 넣어주고 있다.
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    //여기서는 2차적으로 user에 arrey에다가 video._id를 push하고 있다.
    //그리하여 video와 user간의 'relationship' 을 만들어 주고 있다.
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not foun" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  //전역 변수를 만들어 코드가 반복되는 것을 피함.
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
        //정규표현식을 이용하여 사용자가 원하는 것을 찾게 도와줌.
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  video.save();
  return res.sendStatus(200);
};
// status는 render하기 전에 상태 코드를 정할 수 있다.
// sendStatus는 상태 코드를 보내고 연결을 끝내는 것이다.

export const creatComment = (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.end();
};
