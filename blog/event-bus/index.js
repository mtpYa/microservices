const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const events = [];

app.use(cors());
app.use(express.json());

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://localhost:4006/events', event);
  axios.post('http://localhost:4001/events', event);
  axios.post('http://localhost:4002/events', event);
  axios.post('http://localhost:4003/events', event);

  res.status(200).json({ status: 'OK' });
});
app.get('/events', (req, res) => {
  res.status(200).json(events);
});

app.listen(4005, () => console.log('Listening on port 4005'));