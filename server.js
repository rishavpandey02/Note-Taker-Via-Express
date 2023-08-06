const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // if you don't have this, install it using npm install uuid
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(data);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  data.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(data));
  res.json(data);
});

app.delete('/api/notes/:id', (req, res) => {
  let noteId = req.params.id.toString();
  let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  const newData = data.filter(note => note.id.toString() !== noteId);
  fs.writeFileSync('./db/db.json', JSON.stringify(newData));
  res.json(newData);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
