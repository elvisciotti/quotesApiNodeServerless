const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

const db = new sqlite3.Database(__dirname + '/../db/quotes.db');
const CSV_ATTEMPTS_MATCH = [
    '"([^"]+)", *"([^"]+)".*',
    '"([^"]+)", *([^,]+).*',
    '([^,]+), *([^,]+).*',
    '([^,]+), *"([^"]+)".*',
];
const ALREADY_ADDED = [];

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS quotes");
    db.run("CREATE TABLE quotes (quote TEXT, author TEXT, tag TEXT)");

    fs.readdirSync(__dirname + "/csv").map(csvFile => {
        db.run("BEGIN TRANSACTION;");
        // https://nelsonslog.wordpress.com/2014/11/16/node-js-sqlite3-very-slow-bulk-inserts/
        const insertStatement = db.prepare("INSERT INTO quotes (quote, author, tag) VALUES (?, ?, ?)");
        fs.readFileSync(`${__dirname}/csv/${csvFile}`, 'utf8')
            .split("\n")
            .forEach(csvLine => {
                for (let regexprIndex in CSV_ATTEMPTS_MATCH) {
                    let match = csvLine.match(CSV_ATTEMPTS_MATCH[regexprIndex]);
                    if (match && !ALREADY_ADDED.includes(match[1]) && match[1].length > 10) {
                        insertStatement.run([
                            match[1],
                            match[2],
                            csvFile.slice(0, -4)
                        ]);
                        ALREADY_ADDED.push(match[1]);
                        break;
                    }
                }
            });
        insertStatement.finalize();
        db.run("END;", () => console.log(`${csvFile} processed`));
    });
});

db.run("CREATE INDEX IF NOT EXISTS tag_idx ON quotes(tag);");

db.all("SELECT tag, COUNT(*) as c FROM quotes GROUP BY tag", (err, data) => {
    console.log(data);
});

db.get("SELECT COUNT(*) c FROM quotes", (err, row) => {
    console.log(row.c + " records added");
});
