const mongoose = require("mongoose");
const Restaurant = require("../restaurant");
const restaurantList = require("../../restaurant.json").results;

mongoose.connect("mongodb://localhost/restaurant-list"); //* 設定連線到 mongoDB

const db = mongoose.connection; //* 取得資料庫連線狀態

//* 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});

//* 連線成功
db.once("open", () => {
  console.log("mongodb connected!");

  Restaurant.create(restaurantList)
    .then((doc) => {
      console.log(doc);
    })
    .catch((error) => {
      console.error(error);
    });
});
