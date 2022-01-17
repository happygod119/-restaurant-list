const express = require("express");

const router = express.Router();

const Restaurant = require("../../models/restaurant");

router.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurant) => res.render("index", { restaurant }))
    .catch((error) => console.log(error));
});

//search bar
router.get("/search", (req, res) => {
  if (!req.query.keywords) {
    res.redirect("/");
  }

  const keywords = req.query.keywords;
  const keyword = req.query.keywords.trim().toLowerCase();

  Restaurant.find({})
    .lean()
    .then((restaurant) => {
      const filterRestaurantsData = restaurant.filter(
        (data) =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      );
      res.render("index", { restaurant: filterRestaurantsData, keywords });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
