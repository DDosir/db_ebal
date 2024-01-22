const createError = require("http-errors");
const knex = require("knex");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.listen(process.env.PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);

  try {
    const database = knex({
      client: "pg",
      connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      },
      searchPath: ["knex", "public"],
      pool: {
        max: 10,
        min: 2,
        afterCreate: (conn, done) => {
          console.log(database().select("*").from("questions"));
          conn.query("SELECT * FROM questions", (err) => {
            console.log("select err", err);

            if (err) {
              done(err, conn);
            } else {
              console.log(conn);
            }
          });
        },
      },
    });
  } catch (e) {
    console.log("err 228", e);
  } finally {
    console.log("finally");
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
