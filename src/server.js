require("dotenv").config();
require("./../models");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const app = express();

// CORS
app.use((req, res, next) => {
  const origin = req.get("Origin");
  console.log(origin);
  const url = req.originalUrl;
  const allowedOrigins = ["http://localhost:5173"];
  // if (
  //   url === "/api/v1/order/webhook" ||
  //   url === "/api/v1/merchant/profile" ||
  //   url === "/api/v1/invoice/webhook-stripe" ||
  //   url === "/api/v1/order/update/protected-number"
  // ) {
  //   next();
  // } else
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE, UPDATE, PUT, PATCH, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization, user_token, admin_token, shop"
    );
    next();
  } else {
    return res.status(403).send("Forbidden");
  }
});


// * ROUTES * //
const authCheck = require("./middlewares/auth.middeware.js");
const auth = require("./routes/auth.js");
const users = require("./routes/user.js");

app.use(authCheck);

// * Middlewares * //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.APP_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// * Routes * //
try {
  app.use("/check", (req, res, next) => {
    const healthCheckResponse = {
      status: "OK",
      message: "Service is up",
    };
    res.status(200).json(healthCheckResponse);
  });

  app.use("/auth", auth);

  // * ADMIN USERS * //
  app.use("/admin", users);

} catch (error) {
  console.log(error);
}

app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port ${process.env.PORT}!`)
);
