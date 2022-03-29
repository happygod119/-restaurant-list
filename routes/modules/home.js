const express = require("express");

const router = express.Router();

const Restaurant = require("../../models/restaurant");

router.get("/", (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .then((restaurant) =>
      res.render("index", {
        restaurant,
      })
    )
    .catch((error) => console.log(error));
});

//search bar
router.get("/search", (req, res) => {
  const keywords = req.query.keywords;
  const keyword = req.query.keywords.trim().toLowerCase();
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .then((restaurant) => {
      const filterRestaurantsData = restaurant.filter(
        (data) =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      );
      res.render("index", {
        restaurant: filterRestaurantsData,
        keywords,
      });
    })
    .catch((err) => console.log(err));
});

// Dropdown
router.get("/sort", (req, res) => {
  const sort = req.query.sort;
  let sortSelect = {};
  const userId = req.user._id;
  if (Number(sort) === 1) {
    sortSelect = {
      name_en: "asc",
    };
  } else if (Number(sort) === 2) {
    sortSelect = {
      name_en: "desc",
    };
  } else if (Number(sort) === 3) {
    sortSelect = {
      category: "asc",
    };
  } else if (Number(sort) === 4) {
    sortSelect = {
      location: "asc",
    };
  } else {
    sortSelect = {
      _id: "asc",
    };
  }
  Restaurant.find({ userId })
    .lean()
    .sort(sortSelect)
    .then((restaurant) =>
      res.render("index", {
        restaurant,
        sort,
      })
    )
    .catch((error) => console.log(error));
});
module.exports = router;
