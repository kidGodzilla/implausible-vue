const express = require('express');
const download = require('download');
const schedule = require('node-schedule');
const fs = require("fs");

function downloadSqlite() {
    download('https://analytics.servers.do/analytics.sqlite3?i='+(Math.floor(Math.random() * 9999999)), `${__dirname}/public`).then(() => {
        console.log('Downloaded analytics.sqlite3');

        fs.copyFile('./public/analytics.sqlite3', './public/analytics.sqlite3.png', (err) => {
            if (err) throw err;
            console.log('./public/analytics.sqlite3 was copied to ./public/analytics.sqlite3.png');
        });
    });
}

schedule.scheduleJob('30 * * * *', downloadSqlite);
downloadSqlite();

let debug = process.env.DEBUG || false;
const PORT = process.env.PORT || 5001;
const app = express();

// Static directory (everything in `public` is served)
app.use(express.static('dist'));

/**
 * Start Server
 */
const server = app.listen(PORT, function () {
    console.log(`App listening on port ${ PORT }!`);
    server.keepAliveTimeout = 0;
});
