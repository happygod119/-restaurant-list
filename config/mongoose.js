//- 載入 mongoose
const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://alpha:camp@cluster0.ccgss.mongodb.net/restaurant-list?retryWrites=true&w=majority";
//- 設定連線到 mongoDB
mongoose.connect(MONGO_URI);

//- 取得資料庫連線狀態
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
});

module.exports = db