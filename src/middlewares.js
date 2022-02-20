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
