// 2.2 errorHandler
const { logEvents } = require("./logger");
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.trace();
  // old version, not always working
  // console.log(err.stack);
  const status = res.statusCode ? res.statusCode : 500; // server error
  res.status(status);
  res.json({ message: err.message });
};

module.exports = errorHandler;
