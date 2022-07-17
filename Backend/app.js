const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const AppError = require("./utils/appError");
const cors=require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   console.log("hello from middleware ");
//   next();
// });

module.exports = app.get("/resourceShare/", (req, res) => {
  res.status(200).json({
    msg: "successful",
  });
});

app.use("/resourceShare/user", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
});
