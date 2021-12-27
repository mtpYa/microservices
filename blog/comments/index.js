const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
const commentsByPostId = {};

app.use(express.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'ponding' });
  commentsByPostId[req.params.id] = comments;

  await axios.post(
    'http://localhost:4005/events',
    {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending'
      }
    }
  )

  res.status(201).json(comments);
});
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  switch(type) {
    case 'CommentModerated': {
      const { id, postId, status, content } = data;
      const comments = commentsByPostId[postId];
      const comment = comments.find((comment) => comment.id === id);

      comment.status = status;
      await axios.post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          postId,
          content,
          status
        }
      })
    }
  }
  res.status(200).json({});
});


app.listen(4001, () => console.log('Listening on port 4001'));
