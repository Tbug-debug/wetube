import User from "../models/User";
import fetch from "node-fetch";
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
      //유저이름과 이메일이 db에 존재하는지 동시에 확인하여 에러메시지를 보내고 있다.
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
  const user = await User.findOne({ username, socialOnly: false });
  // user 정보와 github를 통안 로그인이 아닌 회원가입을 했는지 db에서 찾는 역할을 한다.
  //socialOnly가 false인 경우 wetube 홈페이지에서만 로그인이 가능하다.
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
  req.session.loggedIn = true; //이것은 session object에다가 유저가 로그인 했을 경우 true로 저장한다.
  req.session.user = user; //이것은 session object에다가 데이터베이스의 user 정보를 저장한다.
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
  //github로 client_id와 scope 그리고 allow_signup을 finalUrl로 보낸다.
  //후에 client는 github로 갔다가 /github/finish으로 redirect된다.
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  //URL에 쓰기 적합한 형태의 쿼리 문자열을 반환한다.
  const finalUrl = `${baseUrl}?${params}`;
  /*그러면 scope에 써져있는 데로 정보를 제공하게 된다.
    동시에 finalUrl에서는 code가 제공된다.
    code와 config 객체를 다시 finalUrl로 만들어 보낸다.*/

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  /* 그 URL로 POST request를 보내게 된다.*/

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    /*그러면 github에서 access_token을 준다.*/

    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    /*access_token으로 github API에서 user정보와 email 정보를 얻게 된다.*/

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    // email 중에 primary와 verified가 true인 email을 찾고 있다.

    let user = await User.findOne({ email: emailObj.email });
    //DB에서 email를 찾고 있다.
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : "Unknown",
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      // 만약 DB에 github email을 가진 user가 없다면, 새로 계정을 만들어 login 시켜준다.
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
    //만약 DB에 같은 email이 존재 할 경우, github로 만들었든, 회원가입을 했던 login을 시켜준다.
  } else {
    return res.redirect("/login");
  }
};
//마지막으로 Access token으로 Github API를 사용하여 2가지 user 정보를 가져온다.

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;
  //const id = req.session.user.id
  console.log(req.session.user);
  const pageTitle = "Edit Profile";
  const emailAddress = await User.findOne({ email });
  const userName = await User.findOne({ username });
  if (username !== req.session.user.username && userName) {
    /*username = 입력값
    req.session.user.username = 세션 object 저장되어있는 값
    username !== req.session.user.username는 true가 반환 되어야 한다. 왜냐하면 값이 달라야 변경한다는 걸 의미하기 때문이다.
    userName은 db에 있는 값으로 db에 값이 이미 존재하면 true가 나오며, 없으면 false가 나온다.*/
    return res.status(400).render("edit-profile", {
      pageTitle,
      errorMessage: "This already exist username",
    });
  }
  if (email !== req.session.user.email && emailAddress) {
    return res.status(400).render("edit-profile", {
      pageTitle,
      errorMessage: "This already exist email",
    });
  }
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordconfirmation },
  } = req;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password incorrect",
    });
  }
  if (newPassword !== newPasswordconfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The new password does not match the confirmation",
    });
  }
  const user = await User.findById(_id); // db에서 user 정보를 찾아온다.
  user.password = newPassword; // db에 password를 새로 입력한 newPassword로 교체한다.
  await user.save(); // db에 저장한다.
  req.session.user.password = user.password; //세션에 있는 user password도 db에 새로 바뀐 password로 교체한다.
  return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("See User");
