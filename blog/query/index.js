const express = require('express');
const cors = require('cors');

const app = express();
const posts = {};

app.use(cors());
app.use(express.json());

app.get('/posts', (req, res) => {
  res.status(200).json(posts);
});
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  switch(type) {
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
      const { id, postId,content, status } = data;
      const comments = posts[postId].comments;
      const comment = comments.find((comment) => comment.id === id);

      comment.status = status;
      comment.content = content;
    }
  }

  res.status(200).json({});
});

app.listen(4002, () => console.log('Listening on port 4002'));