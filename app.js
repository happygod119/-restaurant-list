// Express 環境
const express = require("express");
const app = express();
const port = 3000;

//載入handlebars
const exphbs = require("express-handlebars");

//- 引用 body-parser
const bodyParser = require("body-parser");

//- 載入 mongoose
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restaurant-list"); //- 設定連線到 mongoDB

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

//設定使用handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//使用public設定
app.use(express.static("public"));

//-使用body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//- 瀏覽首頁
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurant) => res.render("index", { restaurant }))
    .catch((error) => console.log(error));
});

//- 新增資料
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

app.post("/restaurants", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// restaurant show
app.get("/restaurants/:id", (req, res) => {
  const restaurant = restaurantList.results.find(
    (item) => item.id.toString() === req.params.id
  );
  res.render("show", { restaurant });
});

//search bar
app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const restaurants = restaurantList.results.filter((item) => {
    return (
      item.name.toLowerCase().includes(keyword.toLowerCase()) || //- 餐廳
      item.category.toLowerCase().includes(keyword) //- 類別
    );
  });
  res.render("index", { restaurant: restaurants, keyword: keyword });
});

// 設定port
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
