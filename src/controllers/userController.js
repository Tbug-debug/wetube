import User from "../models/User";
import bcrypt from "bcrypt";

export const getjoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  // 요청한 html에서 정보들을 저장하고 있다.
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
      //입력된 비밀번호와 확인을 위한 비밀번호가 동일한지 비교하고 있다.
    });
  }
  const exist = await User.exists({ $or: [{ username }, { email }] });
  //$or를 활용하여 username 과 email 두 개의 경우를 한번의 코드로 확인할 수 있다.
  //단점은 개별적인 에러메시지 전송이 어렵다.
  if (exist) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
      //유저이름과 이메일이 db에 존재하는지 동시에 확인하고 있다.
    });
  }
  /*
  if (usernameExist) {
    return res.render("join", {
      pageTitle,
      errorMassage: "This username is already taken",
    });
  }
  const emailExist = await User.exists({ email });
  if (emailExist) {
    return res.render("join", {
      pageTitle,
      errorMassage: "This email is already taken",
    });
  }
  개별적인 에러 메시지를 보여주고 싶은경우 위와 같이 하면 된다.
  */
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
      // 유저를 만들고 있다.
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  // user 정보를 db에서 찾는 역할을 한다.
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
      // db에 있는 user와 유저가 입력한 user 값이 일치한지 일치하지 않은지 비교하고 있다.
    });
  }
  const confirm = await bcrypt.compare(password, user.password);
  // 비밀번호를 암호화 하는 것을 담당한다.
  if (!confirm) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
      //여기는 암호화된 비밀번호를 비교하여 입력된 비밀번호와 db에 저장된 비밀번호를 비교한다.
    });
  }
  req.session.loggedIn = true; //이것은 session object에다가 유저가 로그인 했을 경우 true로 변환한다.
  req.session.user = user; //이것은 session object에다가 데이터베이스의 user 정보를 입력해준다.
  return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");
