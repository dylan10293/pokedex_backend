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
    password: 'mypacepostgresql',
    host: 'my-pace-postgresql1.cbwycgms0wa6.us-east-2.rds.amazonaws.com',
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
        const query = `
            SELECT 
                p.id, 
                p.name, 
                m.name AS moves, 
                t.name AS type, 
                pb.hp, 
                pb.attack, 
                pb.defense, 
                pb.special_attack, 
                pb.special_defense, 
                pb.speed 
            FROM pokemon p 
            JOIN pokemon_moves pm ON p.id = pm.pokemon_id 
            JOIN moves m ON pm.move_id = m.id 
            JOIN pokemon_types pt ON p.id = pt.pokemon_id 
            JOIN types t ON t.id = pt.type_Id 
            JOIN pokemon_base_stats pb ON p.id = pb.pokemon_id
        `;
        const result = await client.query(query);

        res.set("Content-Type", "application/json");
        res.send(result.rows);
    } catch (ex) {
        res.status(500).send("Internal Error - No Pokemon Found");
    }
});

// List of all details of that specific pokemon ID
app.get('/pokemon/:id', async function (req, res) {
    try {
        const { id } = req.params; 

        const client = new Client(clientConfig);
        await client.connect(); 

        const query = `
            SELECT 
                p.id, 
                p.name, 
                m.name AS moves, 
                t.name AS type, 
                pb.hp, 
                pb.attack, 
                pb.defense, 
                pb.special_attack, 
                pb.special_defense, 
                pb.speed 
            FROM pokemon p 
            JOIN pokemon_moves pm ON p.id = pm.pokemon_id 
            JOIN moves m ON pm.move_id = m.id 
            JOIN pokemon_types pt ON p.id = pt.pokemon_id 
            JOIN types t ON t.id = pt.type_Id 
            JOIN pokemon_base_stats pb ON p.id = pb.pokemon_id 
            WHERE p.id = $1
        `;
        const result = await client.query(query, [id]);
        res.json(result.rows);
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
})
// List of all the species and the species ID
app.get('/species', async function(req,res){
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM species");
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    } catch (e) {
        res.status(500).send(e.message);
    } 
    })

    // List of all details of that specific species ID
app.get('/species/:id', async function(req,res){
    try {
        const {id} = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM species WHERE id = $1", [id]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch(e){
        res.status(500).send(e.message);
    }
})

// List of all moves in pokemon
app.get('/moves', async function(req,res){
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT id,name FROM moves");
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch(e){
        res.status(500).send(e.message);
    }
})
// List of all details of that specific move ID
app.get('/moves/:id', async function(req,res){
    try {
        const {id} = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT id,name FROM moves WHERE id = $1", [id]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch(e){
        res.status(500).send(e.Message);
    }
})

//List of all pokemon name, ID, and image(maybe) of that specific TYPE
app.get('/pokemon/types/:type', async function(req, res) {
    try {
        const { type } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query(`
            SELECT t.name, p.name
            FROM pokemon p
            JOIN pokemon_types pt ON pt.pokemon_id = p.id
            JOIN types t ON t.id = pt.type_Id
            WHERE t.name = $1
        `, [type]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

// List of all types in pokemon
app.get('/types', async function(req,res){
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM TYPES");
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch(e){
        res.status(500).send(e.message);
    }
})
// List of all details of that specific type ID
app.get('/types/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query(`
            SELECT t.name, te.attacking_type_id, te.defending_type_id, te.effectiveness
            FROM types t
            JOIN type_effectiveness te
                ON t.id = te.attacking_type_id
                OR t.id = te.defending_type_id
            WHERE t.id = $1
        `, [id]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    } catch (e) {
        res.status(500).send(e.message);
    }
})
// List of all natures in pokemon
app.get('/natures', async function(req,res){
    try {
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT name FROM natures");
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    }
    catch(e){
        res.status(500).send(e.message);
    }
})
// List of all details of that specific nature ID
app.get('/natures/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const client = new Client(clientConfig);
        await client.connect();
        const result = await client.query("SELECT * FROM natures WHERE id = $1", [id]);
        res.set("Content-Type", "application/json");
        res.send(result.rows);
    } catch (e) {
        res.status(500).send(e.message);
    }
});