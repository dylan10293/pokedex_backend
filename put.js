const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.static("public"));
const PORT = 8000;

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
});

const clientConfig = {
	user: 'postgres',
	password: 'postgrespassword',
	host: 'localhost',
	port: 5432,
	database: 'pokedex',
	ssl: false
};

const client = new Client(clientConfig);
client.connect().then(() => {
	console.log("Connected to the database");
}).catch(err => {
	console.error("Database connection error", err);
});

const updateDatabase = async (query, values, res) => {
	try {
		await client.query(query, values);
		res.status(200).send({ message: 'Success' });
	} catch (error) {
		console.error(error);
		res.status(300).send({ error: 'Invalid input' });
	}
};

app.put('/pokemon', async (req, res) => {
	const { id, name, species_id, moves, type, height, weight, stats } = req.body;
	if (!id) return res.status(300).send({ error: 'ID is required' });

	const query = `
    UPDATE pokemon 
    SET 
      name = $2,
      species_id = $3,
      height = $4,
      weight = $5
    WHERE id = $1;
  `;

	try {
		const roundedHeight = height ? Math.round(height) : null;
		const roundedWeight = weight ? Math.round(weight) : null;

		await client.query(query, [id, name, species_id, roundedHeight, roundedWeight]);


		if (moves) {
			await client.query(`DELETE FROM pokemon_moves WHERE pokemon_id = $1;`, [id]);
			await client.query(`INSERT INTO pokemon_moves (pokemon_id, move_id) SELECT $1, UNNEST($2::int[]);`, [id, moves]);
		}

		if (type) {
			await client.query(`DELETE FROM pokemon_types WHERE pokemon_id = $1;`, [id]);
			await client.query(`INSERT INTO pokemon_types (pokemon_id, type_id) SELECT $1, UNNEST($2::int[]);`, [id, type]);
		}

		if (stats) {
			const { hp, attack, defense, special_attack, special_defense, speed } = stats;
			await client.query(`DELETE FROM pokemon_base_stats WHERE pokemon_id = $1;`, [id]);
			await client.query(`
        INSERT INTO pokemon_base_stats (pokemon_id, hp, attack, defense, special_attack, special_defense, speed)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [id, hp, attack, defense, special_attack, special_defense, speed]);
		}

		res.status(200).send({ message: 'Success' });
	} catch (error) {
		console.error(error);
		res.status(300).send({ error: 'Failed to update Pokémon' });
	}
});

app.put('/species', async (req, res) => {
	const { id, name } = req.body;
	if (!id) return res.status(300).send({ error: 'ID is required' });

	const query = `
    UPDATE species 
    SET 
      name = $2
    WHERE id = $1;
  `;

	await updateDatabase(query, [id, name], res);
});

app.put('/moves', async (req, res) => {
	const { id, name, types_id, power, accuracy, power_point } = req.body;
	if (!id) return res.status(300).send({ error: 'ID is required' });

	const query = `
    UPDATE moves 
    SET 
      name = $2,
			types_id = $3,
      power = $4,
      accuracy = $5,
      power_point = $6
    WHERE id = $1;
  `;

	await updateDatabase(query, [id, name, types_id, power, accuracy, power_point], res);
});

app.put('/types', async (req, res) => {
	const { id, name, effectiveness } = req.body;
	if (!id) return res.status(300).send({ error: 'ID is required' });

	const query = `
    UPDATE types 
    SET 
      name = $2
    WHERE id = $1;
  `;
	//TODO: update types effectiveness
	await updateDatabase(query, [id, name], res);
});

app.put('/nature', async (req, res) => {
	const { id, name, increased_stat, decreased_stat, description } = req.body;
	if (!id) return res.status(300).send({ error: 'ID is required' });

	const query = `
    UPDATE natures
    SET
			name = $2,
      increased_stat = $3,
      decreased_stat = $4,
      description = $5
    WHERE id = $1;
  `;

	await updateDatabase(query, [id, name, increased_stat, decreased_stat, description], res);
});
