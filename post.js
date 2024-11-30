"use strict";

const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.static("public"));
const PORT = 8000;

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.listen(PORT, () => {
    console.log('Server listening on port' + PORT);
});

const clientConfig = {
    user: 'postgres',
    password: 'mypacepostgresql',
    host: 'my-pace-postgresql.cb8ea6cg2ykd.us-east-2.rds.amazonaws.com',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    }
};

app.post("/pokemon", async (req, res) => {
    try {
        const pokemon = JSON.parse(req.body["details"])["pokemons"][0];
        const stats = pokemon["stats"];
        const moves = pokemon["moves"];
        const types = pokemon["type"];
        const client = new Client(clientConfig);
        await client.connect();
        const pokemon_query = await client.query("INSERT INTO POKEMON(name,height,weight,species_id) VALUES ($1::text,$2::integer,$3::integer,$4::integer) RETURNING *;", [pokemon['pokemon_name'], parseInt(pokemon['height']), parseInt(pokemon['weight']), parseInt(pokemon['species_id'])]);
        let pokemon_row = pokemon_query["rows"][0];
        const pokemon_base_stats_query = await client.query("INSERT INTO POKEMON_BASE_STATS(pokemon_id,hp,attack,defense,special_attack,special_defense,speed) VALUES ($1::smallint,$2::smallint,$3::smallint,$4::smallint,$5::smallint,$6::smallint,$7::smallint);", [pokemon_row["id"], stats['hp'], stats['attack'], stats['defense'], stats['special_attack'], stats['special_defense'], stats['speed']]);
        await moves.forEach(async (id) => {
            let pokemon_moves_query = await client.query("INSERT INTO POKEMON_MOVES(pokemon_id,move_id) VALUES ($1::integer,$2::integer);", [parseInt(pokemon_row["id"]), parseInt(id)]);
        });
        types.forEach(async (id) => {
            let pokemon_types_query = await client.query("INSERT INTO POKEMON_TYPES(pokemon_id,type_id) VALUES ($1::integer,$2::integer)", [pokemon_row["id"], id]);
        });

        res.set("Content-Type", "application/json");
        res.send("Pokemon added successfully!");
    } catch (ex) {
        console.log(ex);
        res.status(500).send("ERROR - INTERNAL SERVER ERROR");
    }
});

app.post("/pokemon/species", async (req, res) => {
    try {
        const species = JSON.parse(req.query['details']);
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("INSERT INTO SPECIES(name) VALUES ($1::text);", [species['species_name']]);
        res.set("Content-Type", "application/json");
        res.send("Specie added successfully!");
    } catch (ex) {
        console.log(ex);
        res.status(500).send("ERROR - INTERNAL SERVER ERROR");
    }
});

app.post("/pokemon/moves", async (req, res) => {
    try {
        const movess = JSON.parse(req.query['details']);
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("INSERT INTO MOVES(name,types_id,power,accuracy,power_point) VALUES ($1::text,$2::integer,$3::integer,$4::integer,$5::smallint);", [moves['move_name'], moves['type_id'], moves['power'], moves['accuracy'], moves['pp']]);
        res.set("Content-Type", "application/json");
        res.send("Move added successfully!");
    } catch (ex) {
        console.log(ex);
        res.status(500).send("ERROR - INTERNAL SERVER ERROR");
    }
});

app.post("/types", async (req, res) => {
    try {
        const species = JSON.parse(req.query['details']);
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("INSERT INTO TYPES(name) VALUES ($1::text);", [species['type_name']]);
        res.set("Content-Type", "application/json");
        res.send("Type added successfully!");
    } catch (ex) {
        console.log(ex);
        res.status(500).send("ERROR - INTERNAL SERVER ERROR");
    }
});

app.post("/nature", async (req, res) => {
    try {
        const species = JSON.parse(req.query['details']);
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("INSERT INTO NATURES(name, increased_stat, decreased_stat) VALUES ($1::text,$2::text,$3::text);", [species['name'], species['increased_stat'], species['decreased_stat']]);
        res.set("Content-Type", "application/json");
        res.send("Nature added successfully!");
    } catch (ex) {
        console.log(ex);
        res.status(500).send("ERROR - INTERNAL SERVER ERROR");
    }
});