const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport"); //* 引用 passport
const bcrypt = require("bcryptjs"); //* 引用 bcrypt

router.get("/login", (req, res) => {
  res.render("login");
});
// 加入 middleware，驗證 request 登入狀態
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/users/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  // 取得註冊表單參數
  const { email, password, confirmPassword } = req.body;
  const errors = [];
  if (!email || !password || !confirmPassword) {
    errors.push({ message: "所有欄位都是必填。" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不相符！" });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      email,
      password,
      confirmPassword,
    });
  }
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then((user) => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: "這個 Email 已經註冊過了。" });
      return res.render("register", {
        errors,
        email,
        password,
        confirmPassword,
      });
    } else {
      // 如果還沒註冊：寫入資料庫
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) =>
          User.create({
            email,
            password: hash,
          })
        )
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err));
    }
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "你已經成功登出。");
  res.redirect("/users/login");
});

module.exports = router;
