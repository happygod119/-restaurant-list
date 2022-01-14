// Express 環境
const express = require("express");
const app = express();
const port = 3000;

// 載入handlebars
const exphbs = require("express-handlebars");

//- 引用 body-parser
const bodyParser = require("body-parser");

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
const restaurant = require("./models/restaurant");

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

//- 新增資料 new頁面
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});
//- 新增資料  Create 動作
app.post("/restaurants", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//- 瀏覽詳細資料
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.log(error));
});

//- 修改資料
app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});
//- 修改資料 Update 動作
app.post("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .then((restaurant) => {
      (restaurant.name = req.body.name),
        (restaurant.name_en = req.body.name_en),
        (restaurant.category = req.body.category),
        (restaurant.image = req.body.image),
        (restaurant.location = req.body.location),
        (restaurant.phone = req.body.phone),
        (restaurant.google_map = req.body.google_map),
        (restaurant.rating = req.body.rating),
        (restaurant.description = req.body.description);
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.log(error));
});

//- 刪除資料
app.post("/restaurants/:id/delete", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
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
