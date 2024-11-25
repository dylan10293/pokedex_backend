"use strict";

const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.static("public"));
const PORT = 8000;
app.listen(PORT, () => {
    console.log('Server listening on port' + PORT);
});

const clientConfig = {
    user: 'postgres',
    password: 'mypacepokedexpostgresql',
    host: 'pokedex-rds.cfqagimcm2pp.us-east-2.rds.amazonaws.com',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    }

};

//boiler plate code for "get" request feel free to reuse for all routes
app.get('/country', async function (req, res) {
    const code = req.query['code'];
    const client = new Client(clientConfig);
    await client.connect();
    const result = await client.query("SELECT NAME FROM COUNTRY WHERE CODE=$1::text", [code]);
    if (result.rowCount < 1) {
        res.status(500).send("Internal Error - No Country Found");
    } else {
        res.set("Content-Type", "application/json");
        res.send(result.rows[0]);
    }
    await client.end();
});