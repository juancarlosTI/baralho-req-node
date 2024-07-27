const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

// Configuração do pool do PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'backendcards',
    password: '1234',
    port: 5432,
});

// Configurar CORS
app.use(cors());

app.use(bodyParser.json())

app.post('/save-card', async (req,res) => {
    const { url_image, code} = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO cartassalvar (url_image, code) VALUES ($1,$2) RETURNING *',[url_image,code]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Erro ao salvar carta.'});
    }
})

app.get('/saved-cards', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM cartassalvar'
    );
    res.json(result.rows);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})