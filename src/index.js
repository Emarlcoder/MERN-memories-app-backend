import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('APP is running');
})

app.use('/posts', postRoutes);
app.use('/users', userRoutes);

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Server started on port ${port}`)))
  .catch((error) => console.log(error.response.data));
