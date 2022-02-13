import Video from "../models/Video";

/*Video.find({}, (error, videos) => {
  return res.render("home", {pageTitle: "Home", videos});
});
callback 구 버전
*/

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};
//promise 신버전

export const watch = (req, res) => {
  const { id } = req.params;
  //const id  = req.params.id: 구버전 JavaScript / 위에 것은 ES6 버전.
  return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const video = new Video({
    title: title,
    description: description,
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    createdAt: Date.now(),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await video.save();
  return res.redirect("/");
};
