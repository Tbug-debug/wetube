import multer from "multer";

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);

  // session의 유저가 login 했는지 참과 거짓으로 비교하고 있다.
  //만약 세션 유저가 로그인했다면 locals 도 loggedIn이 참이 될 것이다.
  res.locals.siteName = "WETUBE";
  console.log(res.locals);
  res.locals.loggedInUser = req.session.user || {};
  // locals object 안에 loggedInUser를 만들고 그 안에 session user 정보를 넣고 있다.
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "LogIn first");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "LogIn first");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fieldSize: 20000000 },
});
//절대로!!! 절대로!!! DB에 파일을 저장하면 안됨!!!!!!!!!!!!!!!!!!
//DB에는 파일의 위치를 저장하는 것!!!!!!!!!!!!!!!!!!!!!!

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fieldSize: 30000000 },
});
