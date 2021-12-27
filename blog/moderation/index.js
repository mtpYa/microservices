const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  switch(type) {
    case 'CommentCreated': {
      const { id, postId, content } = data;
      const status = content.includes('orange') ?
        'rejected' :
        'approved';

      await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id,
          postId,
          status,
          content
        }
      });
    }
  }

  res.status(200).json({});
});

app.listen(4003, () => console.log('Listenng on port 4003'));