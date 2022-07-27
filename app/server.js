const express = require("express");
const rootRouter = require("./routers/root.router");

const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config(__dirname);

//chuyển req, res về json để tiện thao tác
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api", rootRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
