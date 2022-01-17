const express = require("express");

const router = express.Router();

const Restaurant = require("../../models/restaurant");

//- 新增資料 new頁面
router.get("/new", (req, res) => {
  res.render("new");
});
//- 新增資料  Create 動作
router.post("/", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//- 瀏覽詳細資料
router.get("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.log(error));
});

//- 修改資料 edit頁面
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});
//- 修改資料 Update 動作
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
