//2.4.1 CORS
// at google: fetch("http://localhost:3000/") = ok
// at google: fetch("http://localhost:3500/") = CORS error msg
const allowedOrigins = ["http://localhost:3000"];

module.exports = allowedOrigins;
