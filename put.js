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
