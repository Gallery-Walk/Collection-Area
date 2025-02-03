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