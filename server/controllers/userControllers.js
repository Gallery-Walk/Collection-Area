const { isAuthorized } = require('../utils/auth-utils')
const User = require('../models/User')

exports.createUser = async (req, res) => {
  const { username, bio, password, liked_pictures } = req.body

  const user = await User.create(username, password)
  req.session.userId = user.id

  res.send(user);
}

exports.listUsers = async (req, res) => {
  const users = await User.list()
  res.send(users);
}

exports.showUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.find(id);
  if (!user) return res.sendStatus(404);

  res.send(user);
}

exports.updateUser = async (req, res) => {
  const { username, bio, liked_pictures, password } = req.body;
  const { id } = req.params;
  console.log('Request Body:', req.body)

  if (!isAuthorized(id, req.session)) return res.sendStatus(403);

  const updateUser = await User.update(id, { username, bio, liked_pictures })
  if (!updateUser) return res.sendStatus(404)
  res.send(updateUser)
}

exports.userLikePic = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const updatedUser = await User.likePicture(id, imageUrl);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Picture liked successfully", liked_pictures: updatedUser.liked_pictures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.userGetPic = async (req, res) => {
  try {
    const { id } = req.params;
    const likedPictures = await User.getLikedPictures(id);
    res.json({ liked_pictures: likedPictures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}