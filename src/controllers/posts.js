import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.response.data });
  }
}

export const createPost = async (req, res) => {
  const post = req.body

  const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.response.data })
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params

  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Invalid ID')
  const post = req.body

  try {

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, {
      new: true
    })
    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(404).json({ message: error.response.data })
  }
}

export const deletePost = async (req, res) => {
  const { id: _id } = req.params

  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Invalid ID')

  try {
    await PostMessage.findByIdAndDelete(_id)
    res.status(200).json({ message: 'Post deleted' })
  } catch (error) {
    res.status(404).json({ message: error.response.data })
  }
}

export const likePost = async (req, res) => {
  const { id: _id } = req.params

  if(!req.userId) return res.json({ message: 'You must be logged in to like a post' })

  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Invalid ID')

  const post = await PostMessage.findById(_id)

  const index = post.likes.findIndex((id) => id === String(req.userId))

  if(index === -1) {
    post.likes.push(req.userId)
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })

  res.status(200).json(updatedPost)
}
