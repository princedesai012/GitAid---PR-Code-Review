// backend/index.js
const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ message: 'API Running' }));
app.listen(3000, () => console.log('Server started'));