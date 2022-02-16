import User from "../models/User";

export const getjoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMassage: "Password confirmation does not match",
    });
  }
  const exist = await User.exists({ $or: [{ username }, { email }] });
  //$or를 활용하여 username 과 email 두 개의 경우를 한번의 코드로 확인할 수 있다.
  //단점은 개별적인 에러메시지 전송이 어렵다.
  if (exist) {
    return res.status(400).render("join", {
      pageTitle,
      errorMassage: "This username/email is already taken",
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
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");
