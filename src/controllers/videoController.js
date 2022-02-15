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
  if (!video) {
    return res.render("404", { pageTitle: "404 Video not foun" });
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }); //Video의 object 대신 true false를 받는다.
  if (!video) {
    return res.render("404", { pageTitle: "404 Video not foun" });
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
  const { title, description, hashtags } = req.body;
  try {
    const video = new Video({
      title: title,
      description: description,
      hashtags: Video.formatHashtags(hashtags),
    });
    await video.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
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

export const search = (req, res) => {
  const { keyword } = req.query;
  if (keyword) {
  }
  return res.render("search", { pageTitle: "Search" });
};
