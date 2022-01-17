const Restaurant = require("../restaurant");
const restaurantList = require("../../restaurant.json").results;
const db = require("../../config/mongoose");

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
