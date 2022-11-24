const { Blog } = require('../models');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

exports.upload_blog = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Blog.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User does not exist' });
    }

    const { title, author, body } = req.body;
    if (!title || !author || !body) {
      return res.status(400).json({ msg: 'Please fill empty fields' });
    }

    const newArticle = new Blog({
      title,
      author,
      body,
      user: userId,
    });
    const article = await newArticle.save();
    if (article) {
      return res
        .status(201)
        .json({ msg: "You've successfully uploaded a post" });
    }
  } catch (error) {
    console.log(error);
  }
};
