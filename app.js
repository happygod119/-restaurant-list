// Express 環境
const express = require("express");
const app = express();
const port = 3000;

// 載入handlebars
const exphbs = require("express-handlebars");

//- 引用 body-parser
const bodyParser = require("body-parser");

//- 載入 method-override
const methodOverride = require("method-override");

//- 載入 mongoose
const mongoose = require("mongoose");

//- 設定連線到 mongoDB
mongoose.connect("mongodb://localhost/restaurant-list");

//- 取得資料庫連線狀態
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
});

//- 載入 Restaurant model
const Restaurant = require("./models/restaurant");

//- 引用路由器
const routes = require("./routes");

//設定使用handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//使用public設定
app.use(express.static("public"));

//-使用body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//- 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride("_method"));

//- 將 request 導入路由器
app.use(routes);

// 設定port
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
