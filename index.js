const serverless = require("serverless-http");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const dbPath = __dirname + "/db/quotes.db";
const cors = require("cors");

const app = express();
app.use(cors());

// endpoints
app.get("/tags", function (req, res) {
  const db = new sqlite3.Database(dbPath);

  db.all("SELECT DISTINCT tag from quotes", (err, rows) => {
    if (err) {
      throw new Error(err);
    }
    const tags = rows.map((row) => row.tag);
    res.json(tags);
  });
});

app.get("/quotes", function (req, res) {
  const db = new sqlite3.Database(dbPath);

  const limit = req.query.limit ? req.query.limit : 1;
  const tag = req.query.tag ? req.query.tag : false;
  const sql = tag
    ? `select * FROM quotes WHERE tag="${tag}" ORDER BY random() LIMIT ${limit}`
    : `select * FROM quotes ORDER BY random() LIMIT ${limit}`;

  db.all(sql, (err, rows) => {
    if (err) {
      throw new Error(err);
    }
    const responseArray = rows.map((row) => {
      return {
        quote: row.quote,
        author: row.author,
        tag: row.tag,
      };
    });
    res.json(responseArray);
  });
});

app.get("/stats", function (req, res) {
  const db = new sqlite3.Database(dbPath);

  db.all("SELECT tag, COUNT(*) as c FROM quotes GROUP BY tag", (err, data) => {
    if (err) {
      throw new Error(err);
    }
    res.json(data);
  });
});

app.get("/", function (req, res) {
  res.json("use /tags or /quotes");
});

if (process.argv[2] == "localTesting") {
  app.listen(3000, () => {
    console.log("Listening at http://localhost:3000");
  });
} else {
  module.exports.handler = serverless(app);
}
