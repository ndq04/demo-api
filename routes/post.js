const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const verifyToken = require('../middleware/auth')

// @route POST api/auth/posts
// @desc Get posts
// @access Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.userId,
    }).populate('user', ['username'])
    res.json({success: true, posts})
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.massage,
    })
  }
})

// @route POST api/auth/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
  const {title, description, url, status} = req.body

  // Simple validation
  if (!title) {
    return res
      .status(400)
      .json({success: false, message: 'Title is required'})
  }
  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith('https://')
        ? url
        : `https://${url}`,
      status: status || 'TO LEARN',
      user: req.userId,
    })
    const post = await newPost.save()
    res.json({
      success: true,
      message: 'Happy learning!',
      post,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.massage,
    })
  }
})

// @route PUT api/auth/posts
// @desc Update posts
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
  const {title, description, url, status} = req.body
  const {id} = req.params

  // Simple validation
  if (!title) {
    return res
      .status(400)
      .json({success: false, message: 'Title is required'})
  }
  try {
    let updatePost = {
      title,
      description: description || '',
      url: url.startsWith('https://')
        ? url
        : `https://${url}`,
      status: status || 'TO LEARN',
    }
    const postUpdateCondition = {_id: id, user: req.userId}
    updatePost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatePost,
      {new: true}
    )
    // User not authorised to update post or post not found
    if (!updatePost) {
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not authorised',
      })
    }
    res.json({
      success: true,
      message: 'Update successful',
      post: updatePost,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.massage,
    })
  }
})

// @route DELETE api/auth/posts
// @desc Delete posts
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
  const {id} = req.params

  try {
    const postDeleteCondition = {_id: id, user: req.userId}
    const deletePost = await Post.findOneAndDelete(
      postDeleteCondition
    )
    // User not authorised to update post or post not found
    if (!deletePost) {
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not authorised',
      })
    }
    res.json({
      success: true,
      message: 'Deleted post',
      post: deletePost,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.massage,
    })
  }
})

module.exports = router
