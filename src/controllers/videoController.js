import Video from "../models/Video";

/*Video.find({}, (error, videos) => {
  return res.render("home", {pageTitle: "Home", videos});
});
callback 구 버전
*/

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};
//promise 신버전

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  //const id  = req.params.id: 구버전 JavaScript / 위에 것은 ES6 버전.
  if (!video) {
    return res.render("404", { pageTitle: "404 Video not foun" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  //findById 사용 이유: objec를 edit template으로 보내줘야 하기 때문에 findById가 적헙하다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not foun" });
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  //Video의 object 대신 true false를 받는다.
  //exists 사용 이유: 여기서는 video object가 필요하지않다. 단순히 영상이 존재하는지만 확인하면 된다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not foun" });
  }
  await Video.findByIdAndUpdate(id, {
    //findByIdAndUpdate는 id 값을 인자로 받는다.
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const file = req.file;
  const { title, description, hashtags } = req.body;
  try {
    const video = new Video({
      title: title,
      description: description,
      fileUrl: file.path,
      hashtags: Video.formatHashtags(hashtags),
    });
    await video.save();
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
  console.log(id);
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
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
