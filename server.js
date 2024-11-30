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

// List of all pokemons with all details
app.get('/pokemon', async function (req, res) {
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON");

        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send("Internal Error - No Pokemon Found");
    }
})

// List of all details of that specific pokemon ID
app.get('/pokemon/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON WHERE ID=$1::text", [id]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})

// List of all the species and the species ID
app.get('/pokemon/species', async function (req, res) {
    try {
        const { species } = req.query;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON WHERE species=$1::text", [species]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})
// List of all details of that specific species ID
app.get('/pokemon/species/:id', async function (req, res) {
    try {
        const { species } = req.query;
        const { id } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON WHERE species=$1::text AND id = $1", [id, species]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
});
app.post("/pokemon/species", async (req, res) => {
    try {
        console.log(req.query);
        const species = JSON.parse(req.query['details']);
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("INSERT INTO SPECIES(name) VALUES ($1::text)", [species['species_name']]);
        res.set("Content-Type", "application/json");
        res.send(result);
    } catch (ex) {
        console.log(ex);
        res.status(500).send("ERROR - INTERNAL SERVER ERROR")
    }
});
// List of all moves in pokemon
app.get('/pokemon/moves', async function (req, res) {
    try {
        const { moves } = req.query;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON WHERE moves=$1::text", [moves]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})
// List of all details of that specific move ID
app.get('/pokemon/moves/:id', async function (req, res) {
    try {
        const { moves } = req.query;
        const { id } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON WHERE moves=$1::text AND id = $1", [id, moves]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})
//List of all pokemon name, ID, and image(maybe) of that specific TYPE
app.get('/pokemon/types/:type', async function (req, res) {
    try {
        const { types } = req.query;
        const { type } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON WHERE types=$1::text AND type = $1", [types, type]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})
// List of all types in pokemon
app.get('/types', async function (req, res) {
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM TYPES");
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})
// List of all details of that specific type ID
app.get('/types/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM POKEMON WHERE id = $1", [id]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})
// List of all natures in pokemon
app.get('/nature', async function (req, res) {
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM nature");
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})
// List of all details of that specific nature ID
app.get('/nature/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM nature WHERE id = $1", [id]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch (e) {
        res.status(500).send(e.Message);
    }
})