// Express 環境
const express = require("express");
// 載入express-session
const session = require("express-session");
// 載入handlebars
const exphbs = require("express-handlebars");
//- 引用 body-parser
const bodyParser = require("body-parser");
//- 載入 method-override
const methodOverride = require("method-override");
//* 引用 connect-flash
const flash = require("connect-flash");
//* 判別開發環境
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const routes = require("./routes"); //- 引用路由器
const usePassport = require("./config/passport"); //- 載入設定檔
require("./config/mongoose"); //- 引用mongoose;

const app = express();
const PORT = process.env.PORT;

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      selected: function (option, value) {
        if (option === value) {
          return "selected";
        } else {
          return "";
        }
      },
    },
  })
); //設定使用handlebars
app.set("view engine", "hbs");
app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static("public")); //使用public設定
app.use(bodyParser.urlencoded({ extended: true })); //-使用body-parser
app.use(methodOverride("_method")); //- 設定每一筆請求都會透過 methodOverride 進行前置處理

usePassport(app); //- 呼叫 Passport 函式並傳入

app.use(flash()); //* connect-flash
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
  res.locals.warning_msg = req.flash("loginerr_msg"); // 設定 loginerr_msg 訊息
  next();
});

app.use(routes); //- 將 request 導入路由器

// 設定port
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
