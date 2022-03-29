const express = require("express");

const router = express.Router();

const Restaurant = require("../../models/restaurant");

//- 新增資料 new頁面
router.get("/new", (req, res) => {
  res.render("new");
});
//- 新增資料  Create 動作
router.post("/", (req, res) => {
  const {
    name,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;
  const userId = req.user._id;
  return Restaurant.create({
    name,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId,
  })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//- 瀏覽詳細資料
router.get("/:id", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.log(error));
});

//- 修改資料 edit頁面
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});
//- 修改資料 Update 動作
router.put("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  const {
    name,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;

  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => {
      restaurant.name = name;
      restaurant.category = category;
      restaurant.image = image;
      restaurant.location = location;
      restaurant.phone = phone;
      restaurant.google_map = google_map;
      restaurant.rating = rating;
      restaurant.description = description;
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => console.log(error));
});

//- 刪除資料
router.delete("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
