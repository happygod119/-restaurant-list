// require packages used in the project
const express = require("express");
const mongoose = require("mongoose"); //* 載入 mongoose
const app = express();
const port = 3000;

// require express-handlebars here
const exphbs = require("express-handlebars");
const restaurantList = require("./restaurant.json");

mongoose.connect("mongodb://localhost/restaurant-list"); //* 設定連線到 mongoDB

const db = mongoose.connection; //* 取得資料庫連線狀態

//* 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});

//* 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

// setting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting static files
app.use(express.static("public"));

// routes setting
app.get("/", (req, res) => {
  res.render("index", { restaurant: restaurantList.results });
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

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
