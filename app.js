// Express 環境
const express = require("express");
const app = express();
const port = 3000;
// 載入handlebars
const exphbs = require("express-handlebars");
//- 引用 body-parser
const bodyParser = require("body-parser");
//- 載入 method-override
const methodOverride = require("method-override");



require('./config/mongoose')//- 引用mongoose;


const routes = require("./routes");//- 引用路由器


app.engine("handlebars", exphbs({ defaultLayout: "main" }));//設定使用handlebars
app.set("view engine", "handlebars");
app.use(express.static("public"));//使用public設定
app.use(bodyParser.urlencoded({ extended: true }));//-使用body-parser
app.use(methodOverride("_method"));//- 設定每一筆請求都會透過 methodOverride 進行前置處理

app.use(routes);//- 將 request 導入路由器

// 設定port
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
