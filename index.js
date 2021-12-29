const express = require('express');

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
