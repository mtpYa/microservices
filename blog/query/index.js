const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const posts = {};

app.use(cors());
app.use(express.json());

app.get('/posts', (req, res) => {
  res.status(200).json(posts);
});
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  eventHandler(type, data);

  res.status(200).json({});
});

app.listen(4002, async () => {
  console.log('Listening on port 4002');

  const res = await axios.get('http://localhost:4005/events');

  for(let event of res.data) {
    const { type, data } = event;
    console.log(`Processing event: ${type}`);
    eventHandler(type, data);
  }
});

//-------- helpers -------------

function eventHandler(type, data) {
  switch (type) {
    case 'PostCreated': {
      const { id, title } = data;

      posts[id] = { id, title, comments: [] };
      break;
    }
    case 'CommentCreated': {
      const { id, content, postId, status } = data;

      posts[postId].comments.push({ id, content, status });
      break;
    }
    case 'CommentUpdated': {
      const { id, postId, content, status } = data;
      const comments = posts[postId].comments;
      const comment = comments.find((comment) => comment.id === id);

      comment.status = status;
      comment.content = content;
    }
  }
}
