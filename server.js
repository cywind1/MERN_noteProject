require("dotenv").config();
const express = require("express");
// express() = app object returned = main app
const app = express();
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
// 2.3 cookieParser3
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const { logger, logEvents } = require("./middleware/logger");
const PORT = process.env.PORT || 3500;

connectDB();

console.log(process.env.NODE_ENV);
// match with logs\reqLog.log
app.use(logger);

app.use(cors(corsOptions));
// https://www.geeksforgeeks.org/express-js-express-json-function/
// express.json() = built-in middleware = parses incoming requests with JSON payloads, return object
app.use(express.json());

app.use(cookieParser());
// express.static = middleware = serve static assets, e.g. css / images
app.use("/", express.static(path.join(__dirname, "public")));

// server.js -> root.js -> index.html -> style.css
app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  // res.sendStatus(404) also works (latest version)but without css
  // https://www.geeksforgeeks.org/express-js-res-status-function/
  res.status(404);
  // https://www.geeksforgeeks.org/express-js-req-accepts-function/
  // req.accepts(type) = return string, check if specified content types are acceptable
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
